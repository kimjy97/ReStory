"use client"

import { useState, useRef, useEffect } from "react"
import { Wand2, Download, RefreshCw, CheckCircle2, ChevronRight, AlertTriangle, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DragDropUpload } from "@/components/drag-drop-upload"
import { ErrorDialog } from "@/components/error-dialog"
import { Header } from "@/components/main-haeder"
import { BeforeAfterSlider } from "@/components/before-after-slider"
import { FeaturedCase } from "@/components/featured-case"
import { GalleryGrid } from "@/components/gallery-grid"

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
    <div className="relative min-h-screen">
      {/* Full-screen background image with bottom fade */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-no-repeat bg-cover bg-[15%_-55vw]"
          style={{ backgroundImage: "url(/bg2.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 via-0% to-transparent to-25%" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background via-55% to-transparent to-95%" />
      </div>

      <Header />
      <main className="container flex flex-col items-center mx-auto px-3 sm:px-4 py-6 md:py-14 max-w-6xl relative select-none">
        {/* Flat Minimal Hero Section */}
        <div className="text-center py-10 mb-2 md:mb-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-blue-950 dark:text-lime-200 mb-5">
            빛바랜 기억을 다시 선명하게
          </h2>
          <p className="text-sm sm:text-lg font-medium text-foreground dark:text-foreground max-w-4xl mx-auto tracking-tight leading-relaxed break-keep">
            소중한 가족의 옛날 사진, 어릴 적 소중한 추억이 담긴 아날로그 사진을 선명하고 자연스럽게 복원해 드립니다.<br></br>먼지와 얼룩, 흠집은 지우고 잃어버린 생기를 다시 채워보세요.
          </p>
        </div>

        {/* Gallery Grid - More restoration cases below upload */}
        <div className="w-full mb-24">
          <GalleryGrid />
        </div>

        <div className="flex flex-col items-center mb-20">
          <p className="text-xl mb-6 text-foreground">사진 복원 시작하기</p>
          <ChevronDown className="size-14 animate-bounce text-foreground/20" strokeWidth={1} />
        </div>

        <div className="w-full space-y-12">

          {/* 1. Upload View */}
          {!originalImage && (
            <DragDropUpload onFileSelected={handleFileSelected} />
          )}

          {/* 2. Restoration Console View */}
          {originalImage && !restoredImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Original Preview */}
              <div>
                <div className="aspect-square bg-black rounded-xl overflow-hidden border border-border/20">
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
                    className="w-full py-5 mt-4 border-border hover:bg-accent text-sm font-medium rounded-lg shadow-none flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    사진 교체하기
                  </Button>
                )}
              </div>

              {/* Processing Console */}
              <div className="flex flex-col gap-6 md:p-6 justify-center h-full md:border border-border rounded-xl">
                {isRestoring ? (
                  <div className="space-y-4">
                    {/* Flat simulated checklist log */}
                    <div className="space-y-3 font-sans text-sm leading-relaxed">
                      {restorationSteps.map((step, idx) => {
                        const isDone = idx < currentStepIndex
                        const isCurrent = idx === currentStepIndex

                        return (
                          <div
                            key={idx}
                            className={`flex items-center gap-2.5 ${isDone
                              ? "text-primary font-medium"
                              : isCurrent
                                ? "text-foreground font-medium animate-pulse"
                                : "text-muted-foreground/50"
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
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>추억을 되살리는 중...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-7 overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all duration-300 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-6">
                    <div className="text-center text-muted-foreground leading-relaxed">
                      <p className="text-lg font-medium text-foreground mb-2 flex items-center justify-center gap-1.5">
                        사진 복원 안내사항
                      </p>
                      <ul className="list-inside space-y-1 font-thin text-sm md:text-base">
                        <li>사진 속 흠집, 먼지, 얼룩을 깨끗하게 지워드립니다.</li>
                        <li>빛이 바래고 흐릿해진 얼굴 선과 배경을 선명하게 다듬어 드립니다.</li>
                        <li>흑백 사진은 따뜻하고 자연스러운 색감으로 채색되어 되살아납니다.</li>
                      </ul>
                    </div>

                    <Button
                      onClick={handleRestore}
                      className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/95 py-6 px-6 rounded-xl shadow-none border-0 transition-colors"
                    >
                      <Wand2 className="w-4 h-4" />
                      사진 복원 시작하기
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* 3. Success Results View */}
        {originalImage && restoredImage && (
          <div className="max-w-2xl self-center rounded-2xl sm:p-8 animate-in fade-in duration-300">
            {/* Warning alert if fallback occurred */}
            {warningMessage && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-lg flex items-start gap-2 max-w-2xl mx-auto leading-relaxed">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{warningMessage}</span>
              </div>
            )}

            <div className="text-2xl text-center font-medium tracking-wider mb-2 fade-in animate-in slide-in-from-bottom">복원이 완료되었습니다!</div>

            {/* High-fidelity interactive flat slider */}
            <div className="mx-auto">
              <p className="text-center text-sm md:text-base text-foreground/70 py-4 font-thin">
                슬라이더를 좌우로 드래그하여 복원 전후를 비교해보세요
              </p>
              <BeforeAfterSlider
                originalSrc={originalImage}
                restoredSrc={`data:${restoredImage.mimeType};base64,${restoredImage.data}`}
                className="rounded-2xl overflow-hidden border border-border/30"
              />
            </div>

            <div className="flex flex-row gap-2 py-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleReset}
                className="flex-1 border-border hover:bg-accent hover:text-foreground text-sm rounded-lg shadow-none flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                새로운 사진 선택
              </Button>
              <Button
                size="lg"
                onClick={downloadImage}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/95 text-sm rounded-lg shadow-none flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                복원 사진 다운로드
              </Button>
            </div>

            {/* Warm Nostalgic Note Card */}
          </div>
        )}
        <div className="flex flex-col items-center gap-5 py-32">
          <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full" />
          <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full" />
          <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full" />
        </div>
        <div className="mx-auto px-4 max-w-xl text-center text-base text-muted-foreground leading-relaxed space-y-1 break-keep">
          <p className="text-foreground text-base md:text-lg font-bold font-sans tracking-wider">복원된 사진으로 추억을 나누어 보세요</p>
          <p className="font-sans text-sm md:text-base tracking-wider">소중한 가족과 지인분들에게 선명하게 복원된 사진을 선물하고 따뜻했던 순간의 기억을 함께 나누어 보세요.</p>
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
