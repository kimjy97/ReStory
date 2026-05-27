"use client"

import { useState, useRef, useEffect } from "react"
import { Wand2, Download, RefreshCw, CheckCircle2, ChevronRight, AlertTriangle } from "lucide-react"
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
  const [engineUsed, setEngineUsed] = useState<string>("")
  const [warningMessage, setWarningMessage] = useState<string>("")
  const [error, setError] = useState<{
    message: string
    type?: string
    details?: string
  } | null>(null)

  const originalImageRef = useRef<HTMLDivElement>(null)

  const restorationSteps = [
    "사진을 업로드하고 세심하게 살펴보고 있습니다...",
    "사진에 물든 세월의 흔적(먼지, 얼룩, 흠집)을 꼼꼼히 지우는 중입니다...",
    "빛바랜 색감을 채워 따뜻한 생기를 불어넣고 있습니다...",
    "흐릿해진 얼굴 선과 소중한 표정을 또렷하게 다듬어 드립니다...",
    "소중한 추억 복원이 완료되었습니다! 마음껏 감상해 보세요.",
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
      }, 3000) // Slightly longer wait for two high-performance models
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
      setEngineUsed("")
      setWarningMessage("")
    }
    reader.readAsDataURL(file)
  }

  const handleRestore = async () => {
    if (!selectedFile) return

    setIsRestoring(true)
    setError(null)
    setWarningMessage("")

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
        setEngineUsed(result.engineUsed || "Replicate (flux-kontext-apps/restore-image)")
        setWarningMessage(result.warning || "")
        setProgress(100)
      } else {
        console.error("Restoration failed:", result.error)
        setError({
          message: result.error || "복원 작업에 실패했습니다. 환경 변수와 입력을 다시 확인하고 시도해주세요.",
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
    setEngineUsed("")
    setWarningMessage("")
  }

  return (
    <div className="relative">
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-4xl relative z-10 select-none">
        {/* Flat Minimal Hero Section */}
        <div className="text-center py-10 mb-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
            빛바랜 기억을 다시 선명하게
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            소중한 가족의 옛날 사진, 어릴 적 소중한 추억이 담긴 아날로그 사진을 선명하고 자연스럽게 복원해 드립니다. 먼지와 얼룩, 흠집은 지우고 잃어버린 생기를 다시 채워보세요.
          </p>
        </div>

        <div className="space-y-8">
          {/* 1. Upload View */}
          {!originalImage && (
            <div className="bg-card border border-border/80 dark:border-border/40 rounded-2xl p-8 shadow-none">
              <h3 className="text-sm font-bold text-foreground uppercase mb-5 tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                복원할 사진 선택하기
              </h3>
              <DragDropUpload onFileSelected={handleFileSelected} />
            </div>
          )}

          {/* 2. Restoration Console View */}
          {originalImage && !restoredImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Original Preview */}
              <div className="bg-card rounded-2xl p-6 space-y-4 border border-border/30">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  선택한 원본 사진
                </h3>
                <div className="aspect-square bg-muted/50 rounded-xl overflow-hidden border border-border/20">
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
                    className="w-full border-border hover:bg-accent text-xs font-semibold rounded-lg shadow-none"
                  >
                    사진 교체하기
                  </Button>
                )}
              </div>

              {/* Processing Console */}
              <div className="bg-card rounded-2xl p-6 space-y-6 border border-border/30">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  추억 복원 시작
                </h3>

                {isRestoring ? (
                  <div className="space-y-4">
                    {/* Flat simulated checklist log */}
                    <div className="rounded-xl bg-muted/60 p-5 space-y-3 font-sans text-xs leading-relaxed border border-border/20">
                      {restorationSteps.map((step, idx) => {
                        const isDone = idx < currentStepIndex
                        const isCurrent = idx === currentStepIndex

                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-2.5 ${isDone
                              ? "text-primary font-semibold"
                              : isCurrent
                                ? "text-foreground font-bold animate-pulse"
                                : "text-muted-foreground/40"
                              }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 flex-shrink-0" />
                            )}
                            <span>{step}</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Simple flat loading indicator */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                        <span>추억을 되살리는 중...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all duration-300 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-5 bg-muted/60 rounded-xl text-xs text-muted-foreground leading-relaxed border border-border/20">
                      <p className="font-semibold text-foreground mb-2 flex items-center gap-1.5">
                        추억 복원 안내사항
                      </p>
                      <ul className="list-disc list-inside space-y-1.5 ml-1">
                        <li>사진 속 흠집, 먼지, 얼룩을 깨끗하게 지워드립니다.</li>
                        <li>빛이 바래고 흐릿해진 얼굴 선과 배경을 선명하게 다듬어 드립니다.</li>
                        <li>흑백 사진은 따뜻하고 자연스러운 색감으로 채색되어 되살아납니다.</li>
                      </ul>
                    </div>

                    <Button
                      onClick={handleRestore}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/95 py-3.5 rounded-xl shadow-none border-0 transition-colors"
                    >
                      <Wand2 className="w-4 h-4" />
                      추억 복원 시작하기
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Success Results View */}
          {originalImage && restoredImage && (
            <div className="bg-card border border-border/30 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 gap-4">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  복원 완료
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="border-border hover:bg-accent hover:text-foreground text-xs rounded-lg shadow-none flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    새로운 사진 선택
                  </Button>
                  <Button
                    size="sm"
                    onClick={downloadImage}
                    className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs rounded-lg shadow-none flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    결과 고화질 다운로드
                  </Button>
                </div>
              </div>

              {/* Warning alert if fallback occurred */}
              {warningMessage && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-lg flex items-start gap-2 max-w-2xl mx-auto leading-relaxed">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{warningMessage}</span>
                </div>
              )}

              {/* High-fidelity interactive flat slider */}
              <div className="max-w-2xl mx-auto">
                <BeforeAfterSlider
                  originalSrc={originalImage}
                  restoredSrc={`data:${restoredImage.mimeType};base64,${restoredImage.data}`}
                  className="rounded-2xl overflow-hidden border border-border/30"
                />
                <p className="text-center text-xs text-muted-foreground mt-3 py-4 uppercase">
                  슬라이더를 좌우로 드래그하여 상세 복원 디테일을 비교하세요
                </p>
              </div>

              {/* Warm Nostalgic Note Card */}
              <div className="max-w-2xl mx-auto p-6 bg-muted/60 border border-border/20 rounded-2xl text-center text-xs text-muted-foreground leading-relaxed space-y-1">
                <p className="text-foreground font-bold font-sans">추억을 나누어 보세요</p>
                <p className="font-sans">소중한 가족과 지인분들에게 선명하게 복원된 사진을 선물하고 따뜻했던 순간의 기억을 함께 나누어 보세요.</p>
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
