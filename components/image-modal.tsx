"use client"

import { useEffect } from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  imageAlt: string
  title: string
  showDownload?: boolean
  onDownload?: () => void
}

export function ImageModal({ isOpen, onClose, imageSrc, imageAlt, title, showDownload, onDownload }: ImageModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 max-w-[95vw] max-h-[95vh] bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <div className="flex items-center gap-2">
            {showDownload && onDownload && (
              <Button onClick={onDownload} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                다운로드
              </Button>
            )}
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative max-w-[90vw] max-h-[80vh] overflow-auto">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={imageAlt}
            className="w-full h-full object-contain"
            style={{ maxWidth: "none", maxHeight: "none" }}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">클릭하거나 ESC 키를 눌러 닫기</p>
        </div>
      </div>
    </div>
  )
}
