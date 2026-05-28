"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronsLeftRight, Play, Pause } from "lucide-react"

interface FeaturedCaseProps {
  beforeSrc: string
  afterSrc: string
  beforeLabel?: string
  afterLabel?: string
}

const AUTO_PLAY_INTERVAL = 60 // ms between each frame
const ANIMATION_RANGE = 85 // 15% ~ 85% range

export function FeaturedCase({
  beforeSrc,
  afterSrc,
  beforeLabel = "복원 전",
  afterLabel = "복원 후",
}: FeaturedCaseProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const directionRef = useRef(1)
  const animationFrameRef = useRef<number | null>(null)

  // Auto-play animation loop
  const animate = useCallback(() => {
    setSliderPosition((prev) => {
      const next = prev + directionRef.current * 0.3
      if (next > ANIMATION_RANGE) {
        directionRef.current = -1
        return ANIMATION_RANGE
      }
      if (next < 100 - ANIMATION_RANGE) {
        directionRef.current = 1
        return 100 - ANIMATION_RANGE
      }
      return next
    })
    if (isAutoPlaying && !isDragging) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }
  }, [isAutoPlaying, isDragging])

  // Start/stop animation based on state
  useEffect(() => {
    if (isAutoPlaying && !isDragging) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isAutoPlaying, isDragging, animate])

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
    // Resume auto-play after a short delay when user releases
    setTimeout(() => setIsAutoPlaying(true), 2000)
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
    setIsAutoPlaying(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    handleMove(e.clientX)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying((prev) => !prev)
  }

  return (
    <section className="relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative px-6 sm:px-10 py-10 sm:py-14">
        {/* Slider Area */}
        <div className="relative max-w-3xl mx-auto">
          <div
            ref={containerRef}
            className="relative w-full select-none overflow-hidden rounded-xl border border-border/30 bg-muted aspect-[4/3] sm:aspect-video cursor-ew-resize shadow-lg shadow-primary/5"
            onPointerDown={handlePointerDown}
            style={{ touchAction: "none" }}
          >
            {/* Before Image (Full background) */}
            <img
              src={beforeSrc}
              alt="복원 전"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Before Label (always visible) */}
            <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-background/80 backdrop-blur-md text-foreground border border-border/50 text-xs font-semibold rounded-lg shadow-sm">
              <span className="opacity-70 mr-1">◀</span> {beforeLabel}
            </div>

            {/* After Image (clipped) */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                transition: isDragging ? "none" : "clip-path 0.3s ease-out",
              }}
            >
              <img
                src={afterSrc}
                alt="복원 후"
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* After Label */}
            <div
              className="absolute top-3 z-10 px-3 py-1.5 bg-primary/90 backdrop-blur-md text-primary-foreground text-xs font-semibold rounded-lg shadow-sm"
              style={{
                left: `calc(${sliderPosition}% - 44px)`,
                transition: isDragging ? "none" : "left 0.3s ease-out",
              }}
            >
              {afterLabel} <span className="opacity-70 ml-1">▶</span>
            </div>

            {/* Slider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-lg z-20 pointer-events-none drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]"
              style={{
                left: `${sliderPosition}%`,
                transform: "translateX(-50%)",
                transition: isDragging ? "none" : "left 0.3s ease-out",
              }}
            />

            {/* Slider Handle */}
            <div
              className="absolute top-1/2 z-20 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-xl pointer-events-none -translate-y-1/2 border-2 border-primary/30"
              style={{
                left: `${sliderPosition}%`,
                transform: `translate(-50%, -50%)`,
                transition: isDragging ? "none" : "left 0.3s ease-out",
              }}
            >
              <ChevronsLeftRight className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}