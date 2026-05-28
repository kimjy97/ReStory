"use client"
import React, { useState, useRef, type DragEvent, type ChangeEvent, useEffect } from "react"
import { Upload, Camera } from "lucide-react"
import { resizeImage } from "@/lib/resize-image"

interface DragDropUploadProps {
  onFileSelected: (file: File) => void
}

export function DragDropUpload({ onFileSelected }: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragError, setDragError] = useState<string | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Trigger file input click from global event
  useEffect(() => {
    const handleOpenUploadInput = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    }
    window.addEventListener("open-upload-input", handleOpenUploadInput)
    return () => {
      window.removeEventListener("open-upload-input", handleOpenUploadInput)
    }
  }, [])

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

  const validateAndProcessFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setDragError("이미지 파일만 업로드 가능합니다.")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setDragError("파일 크기는 10MB 이하여야 합니다.")
      return
    }

    setDragError(null)
    setIsResizing(true)

    try {
      // 클라이언트에서 이미지 리사이즈 수행 (2048px 제한, 품질 85%)
      const resizedFile = await resizeImage(file, {
        maxWidth: 2048,
        maxHeight: 2048,
        quality: 0.85,
      })

      const originalSize = (file.size / 1024 / 1024).toFixed(2)
      const resizedSize = (resizedFile.size / 1024 / 1024).toFixed(2)
      console.log(`[리사이즈] ${originalSize}MB → ${resizedSize}MB`)

      onFileSelected(resizedFile)
    } catch (err) {
      console.error("이미지 리사이즈 실패, 원본 파일을 사용합니다:", err)
      onFileSelected(file)
    } finally {
      setIsResizing(false)
    }
  }

  const handleCardClick = () => {
    if (!isResizing && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      className={`border-[3px] border-dashed rounded-2xl px-10 py-28 text-center cursor-pointer transition-colors duration-200 select-none ${isDragging
        ? "border-primary bg-accent"
        : dragError
          ? "border-destructive bg-destructive/10"
          : "border-border hover:border-primary hover:bg-accent"
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleCardClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
      />

      <div className="space-y-4">
        <div className="mx-auto w-12 h-12 flex items-center justify-center">
          <div
            className={`w-full h-full rounded-xl flex items-center justify-center transition-colors duration-200 ${dragError
              ? "bg-destructive text-destructive-foreground"
              : isDragging
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground"
              }`}
          >
            {dragError || isDragging ? (
              <Upload className="w-7 h-7" strokeWidth={1.5} />
            ) : (
              <Camera className="w-7 h-7" strokeWidth={1.5} />
            )}
          </div>
        </div>

        <div className="space-y-1">
          {dragError ? (
            <p className="text-destructive font-semibold text-sm">{dragError}</p>
          ) : (
            <>
              <p className="text-base font-semibold text-foreground">
                {isDragging ? "이미지를 여기에 놓으세요" : "사진을 여기에 업로드하세요"}
              </p>
              <p className="text-xs text-muted-foreground">
                클릭하거나 파일을 드래그하여 드롭하세요
              </p>
            </>
          )}
        </div>

        {!dragError && (
          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-2">
            <span className="px-1.5 py-0.5 border border-border rounded-sm uppercase font-mono bg-background text-muted-foreground">JPG</span>
            <span className="px-1.5 py-0.5 border border-border rounded-sm uppercase font-mono bg-background text-muted-foreground">PNG</span>
            <span className="px-1.5 py-0.5 border border-border rounded-sm uppercase font-mono bg-background text-muted-foreground">MAX 10MB</span>
          </div>
        )}
      </div>
    </div>
  )
}
