import { logger } from "@/lib/logger"
import { checkRateLimit } from "@/lib/rate-limit"
import sharp from "sharp"

// Dynamically fetch the latest version hash for the Replicate model to guarantee future-proof execution
async function getLatestModelVersion(modelOwner: string, modelName: string, token: string): Promise<string> {
  const url = `https://api.replicate.com/v1/models/${modelOwner}/${modelName}`
  const res = await fetch(url, {
    headers: {
      "Authorization": `Token ${token}`,
    },
  })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Failed to fetch model info from Replicate: ${res.statusText} - ${errText}`)
  }
  const data = await res.json()
  if (!data.latest_version || !data.latest_version.id) {
    throw new Error("Could not find latest version ID in Replicate response")
  }
  return data.latest_version.id
}

// Helper function to create prediction and poll until succeeded on Replicate
async function runReplicateModel(version: string, input: any, token: string): Promise<string> {
  const createRes = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version,
      input,
    }),
  })

  if (!createRes.ok) {
    const errText = await createRes.text()
    if (createRes.status === 402) {
      throw new Error("REPLICATE_INSUFFICIENT_CREDIT")
    }
    throw new Error(`Replicate API error creating prediction: ${errText}`)
  }

  const prediction = await createRes.json()
  const pollUrl = prediction.urls.get

  // Poll prediction status
  let attempts = 0
  const maxAttempts = 40 // Wait up to 40 seconds
  while (attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Sleep 1 second

    const pollRes = await fetch(pollUrl, {
      headers: {
        "Authorization": `Token ${token}`,
      },
    })

    if (!pollRes.ok) {
      const errText = await pollRes.text()
      throw new Error(`Replicate API polling error: ${errText}`)
    }

    const currentPrediction = await pollRes.json()

    if (currentPrediction.status === "succeeded") {
      const output = currentPrediction.output
      if (Array.isArray(output)) {
        return output[0]
      }
      if (typeof output === "string") {
        return output
      }
      throw new Error("Unexpected output format from Replicate prediction")
    }

    if (currentPrediction.status === "failed" || currentPrediction.status === "canceled") {
      throw new Error(`Replicate prediction failed or canceled: ${currentPrediction.error || "Unknown error"}`)
    }

    attempts++
  }

  throw new Error("Replicate prediction polling timed out")
}

// Fallback logic utilizing Cloudflare Workers AI
async function runCloudflareRestoration(base64Image: string, accountId: string, apiToken: string): Promise<string> {
  const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/runwayml/stable-diffusion-v1-5-img2img`
  const restorationPrompt = "restore and colorize this photo, remove the stains, dust spots, noise, scratches and stripes from the image, fill in any ripped or torn sections, turning it into a high quality photograph"
  const negativePrompt = "worst quality, low quality, blurry, distorted, low resolution, ugly, bad anatomy, deformed, mutated, extra limbs, out of focus, text, watermark, signature, bad hands"

  const response = await fetch(cfUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: restorationPrompt,
      negative_prompt: negativePrompt,
      image_b64: base64Image,
      strength: 0.35,
      num_steps: 20,
      guidance: 8.5,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Cloudflare API error: ${response.status} - ${errorText}`)
  }

  const contentType = response.headers.get("content-type")
  if (!contentType || !contentType.includes("image")) {
    const text = await response.text()
    throw new Error(`Cloudflare unexpected output content type: ${contentType}, text: ${text.slice(0, 100)}`)
  }

  const buffer = await response.arrayBuffer()
  return Buffer.from(buffer).toString("base64")
}

export async function POST(req: Request) {
  try {
    const replicateToken = process.env.REPLICATE_API_TOKEN
    const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const cfApiToken = process.env.CLOUDFLARE_API_TOKEN

    // Resolve user IP address securely
    const rawIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1"
    const ip = rawIp.split(",")[0].trim()

    // 개발 모드 바이패스 (개발 환경에서는 AI 서버 호출 및 Rate Limit을 건너뛰고 오리지널 이미지를 반환하여 테스트하되, USE_REAL_AI_IN_DEV=true 설정 시 실제 AI 작동 가능)
    const useRealAiInDev = process.env.USE_REAL_AI_IN_DEV === "true"
    if (process.env.NODE_ENV === "development" && !useRealAiInDev) {
      logger.info("개발 환경(development)이 감지되어 모의 복원 처리를 실행합니다. (USE_REAL_AI_IN_DEV=true로 설정 시 실제 AI 테스트 가능)")
      const formData = await req.formData()
      const file = formData.get("image") as File
      if (!file) {
        return Response.json(
          { error: "이미지가 업로드되지 않았습니다.", errorType: "VALIDATION_ERROR" },
          { status: 400 }
        )
      }
      const bytes = await file.arrayBuffer()
      const base64 = Buffer.from(bytes).toString("base64")

      // 실제 복원 API처럼 이미지의 해상도를 대폭 확장하여 반환합니다.
      let simulatedBase64 = base64
      try {
        const sharpInstance = sharp(Buffer.from(bytes))
        const metadata = await sharpInstance.metadata()
        const width = metadata.width ?? 0
        const height = metadata.height ?? 0

        // 1024px보다 작은 저해상도 이미지일 경우 실제 고성능 AI 복원 규격에 맞춰 1500px 너비로 강제 고화질 업스케일링 시뮬레이션
        if (width > 0 && width < 1024) {
          const targetWidth = 1500
          const resizedBuffer = await sharpInstance
            .resize({ width: targetWidth, withoutEnlargement: false })
            .png()
            .toBuffer()
          simulatedBase64 = resizedBuffer.toString("base64")
          const targetHeight = Math.round(height * (targetWidth / width))
          logger.info(`[개발 모킹] 저해상도 이미지 업스케일 시뮬레이션 완료: ${width}x${height} ➜ ${targetWidth}x${targetHeight}`)
        }
      } catch (sharpErr) {
        logger.error("sharp 개발 모킹 해상도 업스케일 오류, 원본 반환:", sharpErr as Error)
      }

      await new Promise((resolve) => setTimeout(resolve, 4000)) // 4초 지연을 주어 프론트엔드 진행 애니메이션 테스트 가능
      return Response.json({
        success: true,
        restoredImages: [
          {
            data: simulatedBase64,
            mimeType: "image/png",
            style: "modern",
            description: "개발 테스트 환경에서 성공적으로 고해상도 모의 복원되었습니다.",
          },
        ],
        message: "개발 테스트 모드로 성공적으로 복원되었습니다!",
        engineUsed: "개발 로컬 테스트 엔진 (시뮬레이션)",
        isFallback: false,
      })
    }

    // 1. IP-based strict Rate Limit Check to protect Replicate balance
    logger.info(`Checking rate limit for user IP: ${ip}`)
    const rateLimit = await checkRateLimit(ip)
    if (!rateLimit.allowed) {
      logger.warn(`User IP ${ip} blocked by rate limit check - Type: ${rateLimit.errorType}`)
      return Response.json(
        {
          error: rateLimit.error,
          errorType: rateLimit.errorType,
          resetTime: rateLimit.resetTime?.toISOString(),
        },
        { status: 429 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("image") as File

    if (!file) {
      return Response.json(
        {
          error: "이미지가 업로드되지 않았습니다.",
          errorType: "VALIDATION_ERROR",
        },
        { status: 400 },
      )
    }

    // Convert file to base64 data URI
    const originalBytes = await file.arrayBuffer()

    // 서버사이드 이미지 리사이즈 안전장치: 2560px 초과 시 리사이즈
    let imageBody: any = Buffer.from(originalBytes)
    try {
      const sharpInstance = sharp(imageBody)
      const metadata = await sharpInstance.metadata()
      const { width = 0, height = 0 } = metadata
      const MAX_DIMENSION = 2560

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const resizedBuffer = await sharpInstance
          .resize({
            width: Math.min(width, MAX_DIMENSION),
            height: Math.min(height, MAX_DIMENSION),
            fit: "inside",
            withoutEnlargement: true,
          })
          .png()
          .toBuffer()
        imageBody = Buffer.from(resizedBuffer)
        logger.info(`서버 사이드 리사이즈 수행: ${width}x${height} → 최대 ${MAX_DIMENSION}px`)
      }
    } catch (sharpErr) {
      logger.warn("서버 이미지 리사이즈 중 오류, 원본 유지:", sharpErr as Error)
    }

    const base64 = imageBody.toString("base64")
    const inputDataUrl = `data:${file.type};base64,${base64}`

    // Core Decision: If Replicate Token exists, try the Premium FLUX Kontext Model
    if (replicateToken) {
      try {
        logger.info("Replicate token found. Initiating Premium FLUX Kontext (restore-image) Model...")

        // Dynamically fetch latest version hash to guarantee future-proof predictions
        const latestVersion = await getLatestModelVersion("flux-kontext-apps", "restore-image", replicateToken)
        logger.info(`Resolved latest version hash for flux-kontext-apps/restore-image: ${latestVersion}`)

        // Trigger prediction on Replicate
        const restoredImageUrl = await runReplicateModel(
          latestVersion,
          {
            input_image: inputDataUrl,
            safety_tolerance: 2, // Highest permissiveness to prevent blocking of vintage prints
            output_format: "png"
          },
          replicateToken
        )

        // Fetch final output
        logger.info("Downloading final restored photo from Replicate...")
        const finalImageRes = await fetch(restoredImageUrl)
        if (!finalImageRes.ok) {
          throw new Error(`Failed to fetch final image: ${finalImageRes.statusText}`)
        }
        const finalBuffer = await finalImageRes.arrayBuffer()
        const finalBase64 = Buffer.from(finalBuffer).toString("base64")

        logger.info("Restoration succeeded using Replicate FLUX Kontext model.")
        return Response.json({
          success: true,
          restoredImages: [
            {
              data: finalBase64,
              mimeType: "image/png",
              style: "modern",
              description: "흐릿했던 인물과 배경을 선명하고 또렷하게 복원했습니다.",
            },
          ],
          message: "성공적으로 복원되었습니다!",
          engineUsed: "Replicate (flux-kontext-apps/restore-image)",
          isFallback: false,
        })
      } catch (err: any) {
        logger.warn("Replicate FLUX Kontext model failed or credit was insufficient. Falling back to Cloudflare Workers AI...", {
          error: err.message,
        })

        if (cfAccountId && cfApiToken) {
          try {
            logger.info("Starting fallback: Running Cloudflare Workers AI free engine...")
            const cfBase64 = await runCloudflareRestoration(base64, cfAccountId, cfApiToken)

            logger.info("Fallback photo restoration successful via Cloudflare Workers AI!")
            return Response.json({
              success: true,
              restoredImages: [
                {
                  data: cfBase64,
                  mimeType: "image/png",
                  style: "modern",
                  description: "따뜻한 아날로그 감성의 부드러운 색채로 복원했습니다.",
                },
              ],
              message: "성공적으로 복원되었습니다!",
              engineUsed: "Cloudflare Workers AI (SD v1.5 Img2Img)",
              isFallback: true,
              warning: "현재 서버 부하로 인해 대체 복원 모드로 부드럽고 따뜻하게 복원되었습니다. 고해상도 출력을 원하시면 잠시 후 다시 시도해 주세요."
            })
          } catch (cfErr: any) {
            logger.error("Both Replicate and Cloudflare fallback engines failed:", cfErr.message)
            return Response.json(
              {
                error: "모든 AI 복원 엔진이 일시적으로 중단되었습니다. 잠시 후 다시 시도해주세요.",
                errorType: "ALL_ENGINES_FAILED",
                details: `Replicate: ${err.message}, Cloudflare: ${cfErr.message}`,
              },
              { status: 502 },
            )
          }
        } else {
          return Response.json(
            {
              error: "Replicate 복원 과정에서 문제가 발생하였고 대체 무료 엔진 설정이 누락되었습니다.",
              errorType: "REPLICATE_CREDIT_ERROR",
              details: err.message,
            },
            { status: 402 },
          )
        }
      }
    } else {
      // Replicate token is not even configured - use Cloudflare directly
      if (cfAccountId && cfApiToken) {
        try {
          logger.info("Replicate token not configured. Using Cloudflare Workers AI free engine directly...")
          const cfBase64 = await runCloudflareRestoration(base64, cfAccountId, cfApiToken)

          logger.info("Photo restoration successful via Cloudflare Workers AI directly!")
          return Response.json({
            success: true,
            restoredImages: [
              {
                data: cfBase64,
                mimeType: "image/png",
                style: "modern",
                description: "따뜻한 아날로그 감성의 부드러운 색채로 복원했습니다.",
              },
            ],
            message: "성공적으로 복원되었습니다!",
            engineUsed: "Cloudflare Workers AI (SD v1.5 Img2Img)",
            isFallback: false,
          })
        } catch (cfErr: any) {
          logger.error("Cloudflare engine failed directly:", cfErr.message)
          return Response.json(
            {
              error: "무료 복원 AI 엔진 가동 중 요류가 발생했습니다.",
              errorType: "CLOUDFLARE_FAILED",
              details: cfErr.message,
            },
            { status: 502 },
          )
        }
      } else {
        return Response.json(
          {
            error: "서버 설정에 등록된 AI 복원 엔진 토큰이 일절 없습니다.",
            errorType: "CONFIG_ERROR",
            details: "No Replicate Token or Cloudflare Tokens configured",
          },
          { status: 500 },
        )
      }
    }
  } catch (error) {
    logger.error("Unexpected error during photo restoration POST handler:", {
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return Response.json(
      {
        error: `이미지 복원 중 예기치 않은 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
        errorType: "UNKNOWN_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
