"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChevronsLeftRight } from "lucide-react"

interface BeforeAfterSliderProps {
  originalSrc: string
  restoredSrc: string
  originalAlt?: string
  restoredAlt?: string
  className?: string
}

export function BeforeAfterSlider({
  originalSrc,
  restoredSrc,
  originalAlt = "복원 전 원본 사진",
  restoredAlt = "복원 후 완료 사진",
  className = "",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50) // Percentage (0-100)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove)
      window.addEventListener("pointerup", handlePointerUp)
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [isDragging])

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    setIsDragging(true)
    handleMove(e.clientX)
  }

  return (
    <div
      ref={containerRef}
      className={`slider-container relative w-full select-none overflow-hidden border border-border rounded bg-muted ${className}`}
      onPointerDown={handlePointerDown}
      style={{ touchAction: "none" }}
    >
      {/* Before Image (Background) */}
      <img
        src={originalSrc}
        alt={originalAlt}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-background/90 text-foreground border border-border text-xs rounded-sm">
        복원 전
      </div>

      {/* After Image (Foreground, clipped) */}
      <div
        className="pointer-events-none"
        style={{
          clipPath: `inset(0 0 0 ${sliderPosition}%)`,
        }}
      >
        <img
          src={restoredSrc}
          alt={restoredAlt}
          className="object-contain pointer-events-none"
        />
      </div>

      <div className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-sm">
        복원 후
      </div>

      {/* Slider Line */}
      <div
        className="slider-line"
        style={{ left: `${sliderPosition}%` }}
      />

      {/* Slider Handle */}
      <div
        className="slider-handle shadow-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <ChevronsLeftRight className="w-4 h-4 text-primary-foreground pointer-events-none" />
      </div>
    </div>
  )
}
