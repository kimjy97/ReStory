import { logger } from "@/lib/logger"

export async function POST(req: Request) {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const apiToken = process.env.CLOUDFLARE_API_TOKEN

    if (!accountId || !apiToken) {
      logger.error("Cloudflare credentials are missing in environment variables")
      return Response.json(
        {
          error: "서버 설정 오류가 발생했습니다. Cloudflare 설정이 올바르지 않습니다.",
          errorType: "CONFIG_ERROR",
          details: "Cloudflare Account ID or API Token is not configured",
        },
        { status: 500 },
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

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")

    logger.info("Starting photo restoration using Cloudflare Workers AI Stable Diffusion v1.5 Img2Img...")

    const restorationPrompt = "restore and colorize this photo, remove the stains, dust spots, noise, scratches and stripes from the image, fill in any ripped or torn sections, turning it into a high quality photograph"
    const negativePrompt = "worst quality, low quality, blurry, distorted, low resolution, ugly, bad anatomy, deformed, mutated, extra limbs, out of focus, text, watermark, signature, bad hands"

    const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/runwayml/stable-diffusion-v1-5-img2img`

    // Call Cloudflare Workers AI API
    const response = await fetch(cfUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: restorationPrompt,
        negative_prompt: negativePrompt,
        image_b64: base64,
        strength: 0.35, // Balanced to keep the original photo structure intact while fully restoring details
        num_steps: 20,  // Max inference steps for best quality
        guidance: 8.5,  // Strong prompt guidance to enhance texture and color fidelity
      }),
    })

    if (!response.ok) {
      const contentType = response.headers.get("content-type")
      let errorDetails = ""

      if (contentType && contentType.includes("application/json")) {
        const errorJson = await response.json()
        logger.error("Cloudflare Workers AI API error response:", errorJson)
        errorDetails = errorJson.errors?.[0]?.message || JSON.stringify(errorJson)
      } else {
        errorDetails = await response.text()
        logger.error("Cloudflare Workers AI API error text:", { errorDetails })
      }

      // Check for specific statuses
      if (response.status === 429) {
        return Response.json(
          {
            error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
            errorType: "QUOTA_EXCEEDED",
            details: errorDetails,
          },
          { status: 429 },
        )
      }

      return Response.json(
        {
          error: "AI 복원 처리 중 오류가 발생했습니다.",
          errorType: "AI_SERVICE_ERROR",
          details: errorDetails,
        },
        { status: response.status || 502 },
      )
    }

    // Response must be a binary stream of the restored image
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("image")) {
      const responseText = await response.text()
      logger.error("Unexpected Cloudflare response content-type:", { contentType, responseText })
      return Response.json(
        {
          error: "AI 서비스가 올바른 이미지 데이터를 반환하지 않았습니다.",
          errorType: "PARSE_ERROR",
          details: `Content-Type: ${contentType}, Response: ${responseText.slice(0, 100)}`,
        },
        { status: 502 },
      )
    }

    const buffer = await response.arrayBuffer()
    const resultBase64 = Buffer.from(buffer).toString("base64")

    logger.info("Photo restoration successful!")

    return Response.json({
      success: true,
      restoredImages: [
        {
          data: resultBase64,
          mimeType: "image/png",
          style: "modern", // Keep as 'modern' for frontend mapping backward compatibility
          description: "Cloudflare Workers AI를 통해 복원된 고화질 이미지",
        },
      ],
      message: "성공적으로 복원되었습니다!",
    })
  } catch (error) {
    logger.error("Unexpected error during photo restoration route:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
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
