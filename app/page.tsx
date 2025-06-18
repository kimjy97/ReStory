"use client"

import { useState, useEffect, useRef } from "react"
import { Wand2, Download, Expand, Check, Info, Palette, Clock, Sparkles, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PWAInstaller } from "@/components/pwa-installer"
import { ImageModal } from "@/components/image-modal"
import { DragDropUpload } from "@/components/drag-drop-upload"
import { Footer } from "@/components/footer"
import { ErrorDialog } from "@/components/error-dialog"

interface RestoredImage {
  data: string
  mimeType: string
  style: string
  description: string
}

type RestorationStyle = "conservative" | "modern" | "balanced"

export default function PhotoRestoration() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [restoredImages, setRestoredImages] = useState<RestoredImage[]>([])
  const [isRestoring, setIsRestoring] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedStyles, setSelectedStyles] = useState<RestorationStyle[]>(["modern"])
  const [progress, setProgress] = useState(0)
  const [currentProcessing, setCurrentProcessing] = useState<string>("")
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [error, setError] = useState<{
    message: string
    type?: string
    details?: string
  } | null>(null)

  const originalImageRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [isOriginalModalOpen, setIsOriginalModalOpen] = useState(false)
  const [selectedRestoredIndex, setSelectedRestoredIndex] = useState<number | null>(null)

  const handleFileSelected = (file: File) => {
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string)
      setRestoredImages([])
      setProgress(0)
    }
    reader.readAsDataURL(file)
  }

  const handleStyleToggle = (style: RestorationStyle) => {
    setSelectedStyles((prev) => {
      if (prev.includes(style)) {
        return prev.filter((s) => s !== style)
      } else {
        return [...prev, style]
      }
    })
  }

  const handleRestore = async () => {
    if (!selectedFile || selectedStyles.length === 0) return

    setIsRestoring(true)
    setProgress(0)
    setCurrentProcessing("이미지 분석 중...")
    setError(null) // 에러 상태 초기화

    try {
      const formData = new FormData()
      formData.append("image", selectedFile)
      formData.append("styles", JSON.stringify(selectedStyles))

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + 10
          return prev
        })
      }, 500)

      setCurrentProcessing("AI 복원 처리 중...")

      const response = await fetch("/api/restore", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      const result = await response.json()

      if (result.success && result.restoredImages) {
        setRestoredImages(result.restoredImages)
        setCurrentProcessing("완료!")

        // 부분 성공인 경우 알림
        if (result.partialSuccess) {
          setTimeout(() => {
            alert(`일부 스타일 복원에 실패했습니다.\n${result.message}`)
          }, 1000)
        }

        setTimeout(() => {
          setCurrentProcessing("")
        }, 1000)
      } else {
        console.error("Restoration failed:", result.error)
        setCurrentProcessing("오류 발생")

        // 구체적인 에러 정보 설정
        setError({
          message: result.error || "알 수 없는 오류가 발생했습니다.",
          type: result.errorType,
          details: result.details,
        })
      }
    } catch (error) {
      console.error("Error:", error)
      setCurrentProcessing("네트워크 오류")

      // 네트워크 에러 처리
      setError({
        message: "네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인하고 다시 시도해주세요.",
        type: "NETWORK_ERROR",
        details: error instanceof Error ? error.message : "Network request failed",
      })
    } finally {
      setIsRestoring(false)
      setTimeout(() => {
        setProgress(0)
        if (!error) {
          setCurrentProcessing("")
        }
      }, 2000)
    }
  }

  const downloadImage = (imageData: string, style: string) => {
    const link = document.createElement("a")
    link.href = `data:image/png;base64,${imageData}`
    link.download = `restory-${style}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadAllImages = () => {
    restoredImages.forEach((image, index) => {
      setTimeout(() => {
        downloadImage(image.data, image.style)
      }, index * 500)
    })
  }

  const getStyleInfo = (style: RestorationStyle) => {
    switch (style) {
      case "conservative":
        return {
          name: "빈티지 보존",
          description: "원본의 따뜻한 느낌을 유지하며 자연스럽게 복원",
          icon: Clock,
          gradient: "from-amber-500 to-orange-600",
          bgGradient: "from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30",
          borderColor: "border-amber-400",
          textColor: "text-amber-700 dark:text-amber-300",
          iconBg: "bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-800 dark:to-orange-800",
        }
      case "modern":
        return {
          name: "모던 향상",
          description: "현대적 색감으로 선명하고 밝게 향상",
          icon: Sparkles,
          gradient: "from-blue-500 to-cyan-600",
          bgGradient: "from-blue-50 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30",
          borderColor: "border-blue-400",
          textColor: "text-blue-700 dark:text-blue-300",
          iconBg: "bg-gradient-to-br from-blue-100 to-cyan-200 dark:from-blue-800 dark:to-cyan-800",
        }
      case "balanced":
        return {
          name: "하이브리드",
          description: "빈티지의 따뜻함과 모던의 선명함을 조화롭게 결합",
          icon: Palette,
          gradient: "from-purple-500 to-pink-600",
          bgGradient: "from-purple-50 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30",
          borderColor: "border-purple-400",
          textColor: "text-purple-700 dark:text-purple-300",
          iconBg: "bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-800 dark:to-pink-800",
        }
      default:
        return {
          name: style,
          description: "",
          icon: Palette,
          gradient: "from-gray-500 to-gray-600",
          bgGradient: "from-gray-50 to-gray-100",
          borderColor: "border-gray-400",
          textColor: "text-gray-700",
          iconBg: "bg-gray-100",
        }
    }
  }

  const getButtonText = () => {
    if (selectedStyles.length === 0) return "스타일을 선택해주세요"
    if (selectedStyles.length === 1) return `${getStyleInfo(selectedStyles[0]).name}로 복원`
    return `${selectedStyles.length}가지 스타일로 복원`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 relative overflow-hidden">
      <PWAInstaller />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-black/30 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                ReStory
              </h3>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Hero Section */}
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-3 py-1.5 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-4 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
              <Sparkles className="w-3 h-3" />
              AI 기반 사진 복원 서비스
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4 leading-tight">
              오래된 사진을 새롭게
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto leading-relaxed">
              첨단 AI 기술로 손상된 사진을 <span className="text-transparent bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text font-semibold">무료로</span> 복원하고 <br />
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold">
                소중한 추억을 되살려보세요
              </span>
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">사진 업로드</h3>
              <button
                onMouseEnter={() => setShowTooltip("upload")}
                onMouseLeave={() => setShowTooltip(null)}
                className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
              >
                <Info className="w-4 h-4" />
              </button>
              {showTooltip === "upload" && (
                <div className="absolute z-10 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg px-2 py-1 -top-8 left-0 shadow-xl whitespace-nowrap">
                  JPG, PNG 파일 지원 (최대 10MB)
                </div>
              )}
            </div>
            <DragDropUpload onFileSelected={handleFileSelected} />
          </div>

          {/* Original Image */}
          {originalImage && (
            <div
              ref={originalImageRef}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 animate-in slide-in-from-bottom-4"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">원본 사진</h3>
              <div className="max-w-sm mx-auto">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden border-2 border-white dark:border-gray-600">
                  <img
                    src={originalImage || "/placeholder.svg"}
                    alt="Original"
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => setIsOriginalModalOpen(true)}
                    onLoad={() => originalImageRef.current?.scrollIntoView({ behavior: "smooth" })}
                  />
                </div>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">
                  클릭하여 크게 보기
                </p>
              </div>
            </div>
          )}

          {/* Style Selection */}
          {originalImage && (
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">복원 스타일 선택</h3>
                <button
                  onMouseEnter={() => setShowTooltip("styles")}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200"
                >
                  <Info className="w-4 h-4" />
                </button>
                {showTooltip === "styles" && (
                  <div className="absolute z-10 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg px-2 py-1 -top-8 left-0 shadow-xl max-w-xs whitespace-nowrap">
                    여러 스타일을 선택하여 결과를 비교해보세요
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["conservative", "balanced", "modern"] as RestorationStyle[]).map((style) => {
                  const styleInfo = getStyleInfo(style)
                  const IconComponent = styleInfo.icon
                  const isSelected = selectedStyles.includes(style)

                  return (
                    <div
                      key={style}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg relative overflow-hidden ${isSelected
                        ? `${styleInfo.borderColor} bg-gradient-to-br ${styleInfo.bgGradient} shadow-xl scale-105`
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white/50 dark:bg-gray-700/50"
                        }`}
                      onClick={() => handleStyleToggle(style)}
                    >
                      {isSelected && (
                        <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-gradient-to-r from-blue-400 to-purple-500"></div>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${styleInfo.iconBg} shadow-md`}>
                            <IconComponent className={`w-4 h-4 ${styleInfo.textColor}`} />
                          </div>
                          <h4 className="font-bold text-base text-gray-900 dark:text-white">{styleInfo.name}</h4>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected
                            ? `bg-gradient-to-br ${styleInfo.gradient} border-transparent shadow-lg`
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                            }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {styleInfo.description}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Progress Bar */}
              {isRestoring && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{currentProcessing}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 shadow-lg relative overflow-hidden"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleRestore}
                disabled={!originalImage || isRestoring || selectedStyles.length === 0}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-base py-3 rounded-lg shadow-xl border-0 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isRestoring ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    AI가 마법을 부리는 중...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    {getButtonText()}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Results */}
          {restoredImages.length > 0 && (
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">복원 결과</h3>
                </div>
                {restoredImages.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadAllImages}
                    className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border-gray-200/50 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    전체 다운로드
                  </Button>
                )}
              </div>

              <div
                className={`grid gap-6 ${restoredImages.length === 1
                  ? "max-w-sm mx-auto"
                  : restoredImages.length === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  }`}
              >
                {restoredImages.map((restoredImage, index) => {
                  const styleInfo = getStyleInfo(restoredImage.style as RestorationStyle)
                  const IconComponent = styleInfo.icon

                  return (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center gap-2 justify-center">
                        <div className={`p-1.5 rounded-lg ${styleInfo.iconBg} shadow-md`}>
                          <IconComponent className={`w-4 h-4 ${styleInfo.textColor}`} />
                        </div>
                        <h4 className="font-bold text-base text-gray-900 dark:text-white">{styleInfo.name}</h4>
                      </div>
                      <div
                        className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 border-2 border-white dark:border-gray-600"
                        onClick={() => setSelectedRestoredIndex(index)}
                      >
                        <img
                          src={`data:${restoredImage.mimeType};base64,${restoredImage.data}`}
                          alt={`Restored ${restoredImage.style}`}
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRestoredIndex(index)}
                          className="flex-none px-2 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border-gray-200/50 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200"
                        >
                          <Expand className="w-3 h-3 mr-1" />
                          보기
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadImage(restoredImage.data, restoredImage.style)}
                          className="flex-1 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border-gray-200/50 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          다운로드
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {originalImage && (
        <ImageModal
          isOpen={isOriginalModalOpen}
          onClose={() => setIsOriginalModalOpen(false)}
          imageSrc={originalImage}
          imageAlt="원본 사진"
          title="원본 사진"
        />
      )}

      {selectedRestoredIndex !== null && restoredImages[selectedRestoredIndex] && (
        <ImageModal
          isOpen={selectedRestoredIndex !== null}
          onClose={() => setSelectedRestoredIndex(null)}
          imageSrc={`data:${restoredImages[selectedRestoredIndex].mimeType};base64,${restoredImages[selectedRestoredIndex].data}`}
          imageAlt={`복원된 사진 - ${getStyleInfo(restoredImages[selectedRestoredIndex].style as RestorationStyle).name}`}
          title={`복원된 사진 - ${getStyleInfo(restoredImages[selectedRestoredIndex].style as RestorationStyle).name}`}
          showDownload={true}
          onDownload={() =>
            downloadImage(restoredImages[selectedRestoredIndex].data, restoredImages[selectedRestoredIndex].style)
          }
        />
      )}
      {/* Error Dialog */}
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
