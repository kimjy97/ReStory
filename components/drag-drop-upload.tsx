"use client"
import { useState, useRef, type DragEvent, type ChangeEvent } from "react"
import { Upload, ImageIcon, Camera, Sparkles } from "lucide-react"

interface DragDropUploadProps {
  onFileSelected: (file: File) => void
}

export function DragDropUpload({ onFileSelected }: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragError, setDragError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDragError(null)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      validateAndProcessFile(file)
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      validateAndProcessFile(file)
    }
  }

  const validateAndProcessFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setDragError("이미지 파일만 업로드 가능합니다.")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setDragError("파일 크기는 10MB 이하여야 합니다.")
      return
    }

    setDragError(null)
    onFileSelected(file)
  }

  const handleCardClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 relative ${
        isDragging
          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 shadow-2xl scale-105 transform"
          : dragError
            ? "border-red-500 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 shadow-xl"
            : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:scale-102 transform"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleCardClick}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileInputChange} accept="image/*" className="hidden" />

      <div className="space-y-4 relative z-10">
        <div className="mx-auto w-16 h-16 relative flex items-center justify-center">
          <div
            className={`w-full h-full rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg relative ${
              isDragging
                ? "bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-2xl scale-110 rotate-3"
                : dragError
                  ? "bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-xl"
                  : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 group-hover:from-blue-100 group-hover:to-purple-100 dark:group-hover:from-blue-800 dark:group-hover:to-purple-800 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-105"
            }`}
          >
            {dragError ? (
              <ImageIcon className="w-8 h-8" />
            ) : isDragging ? (
              <Upload className="w-8 h-8 animate-bounce" />
            ) : (
              <Camera className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
            )}
          </div>

          {/* Sparkle effect - 뱃지가 잘리지 않도록 부모 컨테이너 밖에 배치 */}
          {!dragError && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:animate-spin z-10">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          {dragError ? (
            <p className="text-red-600 dark:text-red-400 font-semibold text-base">{dragError}</p>
          ) : (
            <>
              <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {isDragging ? "✨ 추억을 여기에 놓아주세요" : "📸 소중한 추억을 업로드하세요"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {isDragging ? "파일을 놓으면 마법이 시작됩니다" : "클릭하거나 파일을 드래그하세요"}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-3">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>JPG</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>PNG</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  <span>최대 10MB</span>
                </div>
              </div>
            </>
          )}
        </div>

        {!dragError && (
          <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
            <span className="text-xs font-medium italic">"시간을 되돌리는 첫 걸음"</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent via-purple-300 to-transparent"></div>
          </div>
        )}
      </div>
    </div>
  )
}
