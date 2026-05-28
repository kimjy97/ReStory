/**
 * 이미지 리사이즈 유틸리티
 * 업로드 전 클라이언트에서 이미지 크기를 조절하여 API 전송 비용과 시간을 절약합니다.
 */

export interface ResizeOptions {
  /** 최대 너비 (px). 기본값: 2048 */
  maxWidth?: number
  /** 최대 높이 (px). 기본값: 2048 */
  maxHeight?: number
  /** 출력 이미지 품질 (0 ~ 1). 기본값: 0.85 */
  quality?: number
  /** 출력 포맷. 기본값: 원본과 동일 (JPEG로 fallback) */
  format?: "image/jpeg" | "image/png" | "image/webp"
}

const DEFAULT_OPTIONS: ResizeOptions = {
  maxWidth: 2048,
  maxHeight: 2048,
  quality: 0.85,
}

/**
 * 주어진 File 객체를 리사이즈하여 새 File 객체로 반환합니다.
 * 리사이즈가 필요하지 않은 경우 원본 File을 그대로 반환합니다.
 */
export async function resizeImage(file: File, options: ResizeOptions = {}): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const { maxWidth, maxHeight, quality, format } = opts

  // 이미지 파일이 아닌 경우 그대로 반환
  if (!file.type.startsWith("image/")) {
    return file
  }

  // 이미지 로드
  const img = await createImageBitmap(file)

  // 원본 크기
  let { width, height } = img

  // 리사이즈가 필요 없는 경우 원본 반환
  if (width <= maxWidth! && height <= maxHeight!) {
    img.close()
    return file
  }

  // 비율 유지 리사이즈
  if (width > maxWidth!) {
    height = Math.round(height * (maxWidth! / width))
    width = maxWidth!
  }
  if (height > maxHeight!) {
    width = Math.round(width * (maxHeight! / height))
    height = maxHeight!
  }

  // Canvas에 그려서 리사이즈
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    img.close()
    throw new Error("Canvas 2D context를 생성할 수 없습니다.")
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(img, 0, 0, width, height)
  img.close()

  // Blob으로 변환
  const outputFormat = format || (file.type === "image/png" ? "image/png" : "image/jpeg")
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error("Canvas Blob 변환에 실패했습니다."))
        }
      },
      outputFormat,
      quality
    )
  })

  // 원본 파일명 유지, 확장자는 새 포맷에 맞게 조정
  const fileName = file.name.replace(/\.[^.]+$/, "") + getExtensionFromMime(outputFormat)

  return new File([blob], fileName, {
    type: outputFormat,
    lastModified: Date.now(),
  })
}

function getExtensionFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return ".jpg"
    case "image/png":
      return ".png"
    case "image/webp":
      return ".webp"
    default:
      return ".jpg"
  }
}