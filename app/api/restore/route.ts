import { GoogleGenAI, Modality } from "@google/genai"
import { logger } from "@/lib/logger"

export async function POST(req: Request) {
  try {
    // Check if API key exists
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      logger.error("Google Generative AI API key is missing")
      return Response.json(
        {
          error: "서버 설정 오류가 발생했습니다. 관리자에게 문의해주세요.",
          errorType: "CONFIG_ERROR",
          details: "API key is not configured",
        },
        { status: 500 },
      )
    }

    const formData = await req.formData()
    const file = formData.get("image") as File
    const stylesJson = formData.get("styles") as string

    if (!file) {
      return Response.json(
        {
          error: "이미지가 업로드되지 않았습니다.",
          errorType: "VALIDATION_ERROR",
        },
        { status: 400 },
      )
    }

    let selectedStyles: string[]
    try {
      selectedStyles = JSON.parse(stylesJson)
    } catch (e) {
      return Response.json(
        {
          error: "복원 스타일 정보가 올바르지 않습니다.",
          errorType: "VALIDATION_ERROR",
        },
        { status: 400 },
      )
    }

    if (!selectedStyles || selectedStyles.length === 0) {
      return Response.json(
        {
          error: "복원 스타일을 선택해주세요.",
          errorType: "VALIDATION_ERROR",
        },
        { status: 400 },
      )
    }

    // Validate styles
    const validStyles = ["conservative", "modern", "balanced"]
    const invalidStyles = selectedStyles.filter((style) => !validStyles.includes(style))
    if (invalidStyles.length > 0) {
      return Response.json(
        {
          error: `지원하지 않는 복원 스타일입니다: ${invalidStyles.join(", ")}`,
          errorType: "VALIDATION_ERROR",
        },
        { status: 400 },
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")

    // Initialize Google Generative AI
    let ai
    try {
      ai = new GoogleGenAI({ apiKey })
    } catch (error) {
      logger.error("Google AI 서비스 초기화 실패", { error })
      return Response.json(
        {
          error: "AI 서비스 초기화에 실패했습니다. 잠시 후 다시 시도해주세요.",
          errorType: "AI_INIT_ERROR",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 503 },
      )
    }

    const restorationPrompts = {
      conservative: `Please restore this old damaged photograph with a CONSERVATIVE approach. Create a high-quality restored version that:

- Removes scratches, tears, and physical damage carefully
- Fixes fading and improves color saturation moderately
- Enhances clarity and sharpness subtly
- Corrects discoloration while preserving vintage character
- Maintains the original composition and authentic feel
- Results in a naturally restored photograph with vintage charm
- Keeps the original mood and atmosphere
- Ensures natural and realistic skin tones, avoiding artificial or overly desaturated appearances

Generate the conservatively restored image.`,
      modern: `Please restore this old damaged photograph with a MODERN approach. Create a high-quality restored version that:

- Removes all scratches, tears, and physical damage completely
- Naturally enhances color saturation while maintaining realistic tones
- Improves clarity and sharpness appropriately without over-processing
- Applies balanced modern color grading with natural contemporary colors
- Brightens the image moderately while preserving natural skin tones
- Creates a fresh and clear appearance without oversaturation
- Results in a professionally enhanced photograph with realistic colors
- The human appearance should remain natural and lifelike
- Avoids overly vibrant or artificial-looking colors
- Maintains color harmony and natural balance
- Prioritize accurate and diverse skin tone representation, ensuring they appear healthy, natural, and free from undesirable color casts
- The overall color balance should complement natural skin tones

Generate the modernly enhanced image with natural and balanced colors.`,
      balanced: `Please restore this old damaged photograph with a BALANCED HYBRID approach that combines the best of vintage and modern techniques. Create a high-quality restored version that:

- Removes all scratches, tears, and physical damage completely
- Preserves the warm, nostalgic character of vintage photography while adding modern clarity
- Enhances colors naturally - not too muted like pure vintage, not too vibrant like pure modern
- Applies a harmonious blend of vintage warmth and modern sharpness
- Maintains authentic skin tones with a subtle warm undertone that feels both classic and contemporary
- Creates depth and dimension while preserving the original emotional atmosphere
- Results in a timeless photograph that feels both nostalgic and fresh
- Balances the sepia/warm tones of vintage with the clarity and detail of modern processing
- The final image should feel like a perfectly preserved memory - clear enough to see every detail, warm enough to evoke nostalgia
- Ensures the restoration honors both the historical character and modern viewing expectations
- Creates a sophisticated, museum-quality restoration that bridges past and present

Generate the balanced hybrid restored image that perfectly combines vintage warmth with modern clarity.`,
    }

    const restorationResults = []
    const failedStyles = []

    // Generate images for each selected style
    for (const style of selectedStyles) {
      try {
        const contents = [
          { text: restorationPrompts[style as keyof typeof restorationPrompts] },
          {
            inlineData: {
              mimeType: file.type,
              data: base64,
            },
          },
        ]

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash-preview-image-generation",
          contents: contents,
          config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE],
          },
        })

        // Safely process the response with detailed logging
        let restoredImageData = null
        let responseText = ""

        // Check if response exists
        if (!response) {
          logger.error(`'${style}' 스타일 AI 응답 없음`)
          throw new Error("No response received from AI service")
        }

        // Check candidates
        if (!response.candidates) {
          logger.error(`'${style}' 스타일 응답에 후보 없음`)
          throw new Error("No candidates in AI response")
        }

        if (!Array.isArray(response.candidates)) {
          logger.error(`'${style}' 스타일 후보가 배열이 아님`, { type: typeof response.candidates })
          throw new Error("Candidates is not an array")
        }

        if (response.candidates.length === 0) {
          logger.error(`'${style}' 스타일 후보 배열이 비어 있음`)
          throw new Error("Empty candidates array")
        }

        const candidate = response.candidates[0]

        if (!candidate) {
          logger.error(`'${style}' 스타일 첫 번째 후보가 정의되지 않음`)
          throw new Error("First candidate is undefined")
        }

        if (!candidate.content) {
          logger.error(`'${style}' 스타일 후보 내용이 정의되지 않음`, { candidate: JSON.stringify(candidate, null, 2) })
          throw new Error("Candidate content is undefined")
        }

        if (!candidate.content.parts) {
          logger.error(`'${style}' 스타일 후보 내용 부분이 정의되지 않음`)
          throw new Error("Candidate content parts is undefined")
        }

        if (!Array.isArray(candidate.content.parts)) {
          logger.error(`'${style}' 스타일 후보 내용 부분이 배열이 아님`, { type: typeof candidate.content.parts })
          throw new Error("Candidate content parts is not an array")
        }

        // Process each part safely
        for (let i = 0; i < candidate.content.parts.length; i++) {
          const part = candidate.content.parts[i]

          if (!part) {
            continue
          }

          if (part.text) {
            responseText += part.text
          } else if (part.inlineData && part.inlineData.data) {
            restoredImageData = part.inlineData.data
          }
        }

        if (restoredImageData) {
          restorationResults.push({
            data: restoredImageData,
            mimeType: "image/png",
            style: style,
            description: responseText || `${style} 스타일로 복원된 이미지`,
          })
        } else {
          failedStyles.push(style)
          logger.error(`'${style}' 스타일 이미지 데이터 수신 실패`)
        }
      } catch (error) {
        logger.error(`'${style}' 스타일 복원 중 오류 발생`, { error, stack: error instanceof Error ? error.stack : "No stack trace" })
        failedStyles.push(style)

        // Check for specific API errors
        if (error instanceof Error) {
          const errorMessage = error.message.toLowerCase()

          if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
            return Response.json(
              {
                error: "일일 사용량 한도에 도달했습니다. 내일 다시 시도해주세요.",
                errorType: "QUOTA_EXCEEDED",
                details: error.message,
              },
              { status: 429 },
            )
          } else if (errorMessage.includes("safety") || errorMessage.includes("blocked")) {
            return Response.json(
              {
                error: "업로드된 이미지가 안전 정책에 위배됩니다. 다른 이미지를 시도해주세요.",
                errorType: "SAFETY_ERROR",
                details: error.message,
              },
              { status: 400 },
            )
          } else if (errorMessage.includes("timeout") || errorMessage.includes("deadline")) {
            return Response.json(
              {
                error: "처리 시간이 초과되었습니다. 이미지 크기를 줄이거나 잠시 후 다시 시도해주세요.",
                errorType: "TIMEOUT_ERROR",
                details: error.message,
              },
              { status: 408 },
            )
          } else if (errorMessage.includes("invalid") || errorMessage.includes("format")) {
            return Response.json(
              {
                error: "이미지 형식이 지원되지 않습니다. JPG 또는 PNG 파일을 사용해주세요.",
                errorType: "VALIDATION_ERROR",
                details: error.message,
              },
              { status: 400 },
            )
          }
        }
      }
    }

    // If all styles failed, provide a more helpful error message
    if (restorationResults.length === 0) {
      logger.error("모든 복원 시도 실패", { failedStyles })

      // Check if it's likely an API issue
      if (failedStyles.length === selectedStyles.length) {
        return Response.json(
          {
            error: "현재 AI 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.",
            errorType: "AI_SERVICE_ERROR",
            failedStyles: failedStyles,
            details: "All restoration styles failed - likely API issue",
            suggestions: [
              "몇 분 후 다시 시도해주세요",
              "이미지 크기를 줄여서 시도해보세요",
              "다른 이미지로 테스트해보세요",
            ],
          },
          { status: 503 },
        )
      }

      return Response.json(
        {
          error: "이미지 복원에 실패했습니다. 다른 이미지를 시도하거나 잠시 후 다시 시도해주세요.",
          errorType: "GENERATION_FAILED",
          failedStyles: failedStyles,
          details: "No restored images were generated",
        },
        { status: 500 },
      )
    }

    // Partial success case
    let message = ""
    if (failedStyles.length > 0) {
      const successCount = restorationResults.length
      const totalCount = selectedStyles.length
      const failedStyleNames = failedStyles
        .map((style) => {
          switch (style) {
            case "conservative":
              return "빈티지 보존"
            case "modern":
              return "모던 향상"
            case "balanced":
              return "하이브리드"
            default:
              return style
          }
        })
        .join(", ")

      message = `${successCount}/${totalCount} 스타일 복원 완료 (실패: ${failedStyleNames})`
    } else {
      const styleNames = restorationResults
        .map((result) => {
          switch (result.style) {
            case "conservative":
              return "빈티지 보존"
            case "modern":
              return "모던 향상"
            case "balanced":
              return "하이브리드"
            default:
              return result.style
          }
        })
        .join(", ")
      message = `${styleNames} 스타일로 복원이 완료되었습니다!`
    }

    logger.info(`총 ${restorationResults.length}개의 복원 이미지 생성 완료`, {
      successfulStyles: restorationResults.map((r) => r.style),
      failedStyles: failedStyles,
    })

    return Response.json({
      success: true,
      restoredImages: restorationResults,
      message: message,
      partialSuccess: failedStyles.length > 0,
      failedStyles: failedStyles,
    })
  } catch (error) {
    logger.error("이미지 복원 중 예기치 않은 오류 발생", { error, stack: error instanceof Error ? error.stack : "No stack trace" })

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return Response.json(
        {
          error: "네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인하고 다시 시도해주세요.",
          errorType: "NETWORK_ERROR",
          details: error.message,
        },
        { status: 503 },
      )
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return Response.json(
        {
          error: "서버 응답을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          errorType: "PARSE_ERROR",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return Response.json(
      {
        error: `이미지 복원 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
        errorType: "UNKNOWN_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
