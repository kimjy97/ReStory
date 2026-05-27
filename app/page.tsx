"use client"

import { useState, useRef, useEffect } from "react"
import { Wand2, Download, RefreshCw, CheckCircle2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DragDropUpload } from "@/components/drag-drop-upload"
import { ErrorDialog } from "@/components/error-dialog"
import { Header } from "@/components/main-haeder"
import { BeforeAfterSlider } from "@/components/before-after-slider"

interface RestoredImage {
  data: string
  mimeType: string
  style: string
  description: string
}

export default function PhotoRestoration() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [restoredImage, setRestoredImage] = useState<RestoredImage | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [error, setError] = useState<{
    message: string
    type?: string
    details?: string
  } | null>(null)

  const originalImageRef = useRef<HTMLDivElement>(null)

  const restorationSteps = [
    "이미지 해상도 및 화학적 훼손 상태 분석 중...",
    "물리적 먼지, 잔기스 및 지문 스크래치 정밀 검출 중...",
    "손실된 픽셀 캔버스 영역 미세 보간 매핑 중...",
    "Cloudflare Workers AI 디퓨전(SDXL) 컬러 복원 중...",
    "복원 완료! 노이즈 제거 및 선명도 향상 합성 중...",
  ]

  // Simulate step-by-step restoration log progress
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRestoring) {
      setCurrentStepIndex(0)
      setProgress(5)
      
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < restorationSteps.length - 1) {
            const nextStep = prev + 1
            setProgress(Math.floor((nextStep / restorationSteps.length) * 100))
            return nextStep
          }
          setProgress(95)
          return prev
        })
      }, 2500)
    } else {
      setCurrentStepIndex(-1)
      setProgress(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRestoring])

  const handleFileSelected = (file: File) => {
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string)
      setRestoredImage(null)
      setProgress(0)
    }
    reader.readAsDataURL(file)
  }

  const handleRestore = async () => {
    if (!selectedFile) return

    setIsRestoring(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", selectedFile)

      const response = await fetch("/api/restore", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success && result.restoredImages && result.restoredImages.length > 0) {
        setRestoredImage(result.restoredImages[0])
        setProgress(100)
      } else {
        console.error("Restoration failed:", result.error)
        setError({
          message: result.error || "복원 작업에 실패했습니다. 이미지를 다시 확인하고 시도해주세요.",
          type: result.errorType,
          details: result.details,
        })
      }
    } catch (err) {
      console.error("Error:", err)
      setError({
        message: "네트워크 연결에 문제가 있습니다. 인터넷 상태를 확인하고 다시 시도해주세요.",
        type: "NETWORK_ERROR",
        details: err instanceof Error ? err.message : "Network request failed",
      })
    } finally {
      setIsRestoring(false)
    }
  }

  const downloadImage = () => {
    if (!restoredImage) return
    const link = document.createElement("a")
    link.href = `data:${restoredImage.mimeType};base64,${restoredImage.data}`
    link.download = `restory-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setOriginalImage(null)
    setRestoredImage(null)
    setSelectedFile(null)
    setProgress(0)
    setCurrentStepIndex(-1)
  }

  return (
    <div className="relative">
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-4xl relative z-10 select-none">
        {/* Flat Minimal Hero Section */}
        <div className="text-center py-6 border-b border-border mb-10">
          <h2 className="text-3xl font-black tracking-tight text-foreground uppercase mb-2">
            AI DIGITAL HERITAGE PRESERVATION
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto font-medium">
            첨단 Cloudflare Workers AI 모델을 이용해 훼손된 아날로그 옛날 사진에서 스크래치, 잡음 및 변색을 정밀 복원합니다.
          </p>
        </div>

        <div className="space-y-8">
          {/* 1. Upload View */}
          {!originalImage && (
            <div className="bg-card border border-border rounded p-6">
              <h3 className="text-sm font-bold text-foreground uppercase mb-4 tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                STEP 1. 원본 사진 아카이브
              </h3>
              <DragDropUpload onFileSelected={handleFileSelected} />
            </div>
          )}

          {/* 2. Restoration Console View */}
          {originalImage && !restoredImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Original Preview */}
              <div className="bg-card border border-border rounded p-6 space-y-4">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  분석 대상 원본
                </h3>
                <div className="aspect-square bg-muted rounded border border-border overflow-hidden">
                  <img
                    src={originalImage}
                    alt="Original Uploaded"
                    className="w-full h-full object-contain"
                  />
                </div>
                {!isRestoring && (
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full border-border hover:bg-accent text-xs font-bold rounded shadow-none"
                  >
                    사진 교체하기
                  </Button>
                )}
              </div>

              {/* Processing Console */}
              <div className="bg-card border border-border rounded p-6 space-y-6">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  복원 컨트롤 패널
                </h3>

                {isRestoring ? (
                  <div className="space-y-4">
                    {/* Flat simulated checklist log */}
                    <div className="border border-border rounded bg-muted p-4 space-y-2.5 font-mono text-[11px] leading-relaxed">
                      {restorationSteps.map((step, idx) => {
                        const isDone = idx < currentStepIndex
                        const isCurrent = idx === currentStepIndex
                        
                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 ${
                              isDone
                                ? "text-primary font-semibold"
                                : isCurrent
                                ? "text-foreground font-bold animate-pulse"
                                : "text-muted-foreground/50"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                            )}
                            <span>{step}</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Simple flat loading indicator */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-muted-foreground font-mono">
                        <span>PRESERVING WORK...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-secondary border border-border rounded-sm h-2 overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted border border-border rounded text-xs text-muted-foreground leading-relaxed">
                      <p className="font-bold text-foreground uppercase mb-1 flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-primary rounded-full"></span>
                        AI RESTORATION CONFIG
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>엔진: Cloudflare Workers AI Model</li>
                        <li>아키텍처: Stable Diffusion v1.5 Img2Img</li>
                        <li>복원 방법: 물리 손상 복구, 이염 복제, 고해상 채색</li>
                      </ul>
                    </div>

                    <Button
                      onClick={handleRestore}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/95 font-bold py-3 rounded shadow-none border-0 transition-colors"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      디지털 복원 시작하기
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Success Results View */}
          {originalImage && restoredImage && (
            <div className="bg-card border border-border rounded p-6 space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  STEP 3. 아카이브 복원 결과 플레이트
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="border-border hover:bg-accent text-xs font-bold rounded shadow-none flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    새 사진 복원하기
                  </Button>
                  <Button
                    size="sm"
                    onClick={downloadImage}
                    className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold rounded shadow-none flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    결과 고화질 다운로드
                  </Button>
                </div>
              </div>

              {/* High-fidelity interactive flat slider */}
              <div className="max-w-2xl mx-auto">
                <BeforeAfterSlider
                  originalSrc={originalImage}
                  restoredSrc={`data:${restoredImage.mimeType};base64,${restoredImage.data}`}
                  className="border border-border rounded"
                />
                <p className="text-center text-xs text-muted-foreground mt-3 font-semibold uppercase">
                  슬라이더를 좌우로 드래그하여 상세 복원 디테일을 비교하세요
                </p>
              </div>

              {/* Flat Technical Plate Card */}
              <div className="max-w-2xl mx-auto p-4 bg-muted border border-border rounded grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-muted-foreground">RESTORATION SYSTEM:</span>{" "}
                  <span className="text-foreground font-bold">CLOUDFLARE WORKERS AI</span>
                </div>
                <div>
                  <span className="text-muted-foreground">ALGORITHM ENGINE:</span>{" "}
                  <span className="text-foreground font-bold">SD v1.5 (IMG2IMG)</span>
                </div>
                <div>
                  <span className="text-muted-foreground">OUTPUT RESOLUTION:</span>{" "}
                  <span className="text-foreground font-bold">1024 X 1024 PIXELS</span>
                </div>
                <div>
                  <span className="text-muted-foreground">STATUS STATE:</span>{" "}
                  <span className="text-primary font-bold">ARCHIVAL SUCCESSFUL</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Error dialog */}
      {error && (
        <ErrorDialog
          isOpen={!!error}
          onClose={() => setError(null)}
          error={error}
          onRetry={() => {
            setError(null)
            handleRestore()
          }}
        />
      )}
    </div>
  )
}
