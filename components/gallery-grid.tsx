"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import { SliderHandle } from "@/components/ui/slider-handle"

interface GalleryItem {
  id: number
  beforeSrc: string
  afterSrc: string
  title?: string
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    beforeSrc: "/before_after/before_1.jpg",
    afterSrc: "/before_after/after_1.png",
    title: "가족 사진 복원",
  },
  {
    id: 2,
    beforeSrc: "/before_after/before_2.jpg",
    afterSrc: "/before_after/after_2.png",
    title: "옛날 사진 복원",
  },
  {
    id: 3,
    beforeSrc: "/before_after/before_3.jpg",
    afterSrc: "/before_after/after_3.png",
    title: "추억 사진 복원",
  },
  {
    id: 4,
    beforeSrc: "/before_after/before_4.png",
    afterSrc: "/before_after/after_4.png",
    title: "손상된 사진 복원",
  },
]

export function GalleryGrid() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleOpenDialog = (item: GalleryItem) => {
    setSelectedItem(item)
    setSliderPosition(50)
  }

  const handleCloseDialog = () => {
    setSelectedItem(null)
    setSliderPosition(50)
  }

  const handleSliderMove = (clientX: number, container: HTMLDivElement) => {
    const rect = container.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handlePointerDown = (e: React.PointerEvent, container: HTMLDivElement) => {
    e.preventDefault()
    setIsDragging(true)
    handleSliderMove(e.clientX, container)

    const handleMove = (ev: PointerEvent) => {
      if (container) handleSliderMove(ev.clientX, container)
    }

    const handleUp = () => {
      setIsDragging(false)
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerup", handleUp)
    }

    window.addEventListener("pointermove", handleMove)
    window.addEventListener("pointerup", handleUp)
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mx-auto">
        {galleryItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleOpenDialog(item)}
            className="group relative aspect-[4/3] rounded-sm md:rounded-xl overflow-hidden bg-muted cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Split view thumbnail: left = before, right = after */}
            <img
              src={item.beforeSrc}
              alt={`${item.title} - 복원 전`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: "inset(0 0 0 50%)" }}
            >
              <img
                src={item.afterSrc}
                alt={`${item.title} - 복원 후`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Divider line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/80 shadow z-10" />

            {/* Labels */}
            <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-background/90 text-foreground border border-border text-[10px] font-semibold rounded-sm backdrop-blur-sm">
              전
            </div>
            <div className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-sm backdrop-blur-sm">
              후
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 z-20 flex items-center justify-center">
              <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                자세히 보기
              </span>
            </div>

            {/* Bottom title */}
            <div className="absolute bottom-0 inset-x-0 z-20 p-2.5 bg-gradient-to-t from-black/75 to-transparent">
              <span className="text-white text-[11px] font-medium">{item.title}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Dialog Overlay for detailed before/after comparison */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogTitle className="sr-only">
          {selectedItem?.title || "복원 전후 비교"}
        </DialogTitle>
        <DialogContent className="w-fit min-w-[300px] max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-3rem)] p-4 sm:p-6 bg-background border-border/50 flex flex-col items-center">
          <div className="flex flex-col items-center w-full">
            <h4 className="text-sm text-foreground mb-4">
              {selectedItem?.title || "복원 전후 비교"}
            </h4>
            <div className="w-full">
              {selectedItem && (
                <div
                  className="relative select-none overflow-hidden rounded-xl bg-black cursor-ew-resize mx-auto"
                  style={{ touchAction: "none", width: "fit-content", maxWidth: "100%" }}
                  onPointerDown={(e) => handlePointerDown(e, e.currentTarget)}
                >
                  {/* Hidden after image provides natural container sizing */}
                  <img
                    src={selectedItem.afterSrc}
                    alt=""
                    className="block max-h-[80vh] w-auto h-auto pointer-events-none invisible"
                  />

                  {/* Before Image overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <img
                      src={selectedItem.beforeSrc}
                      alt="복원 전"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Before Label */}
                  <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-background/90 text-foreground border border-border text-xs font-semibold rounded-md backdrop-blur-sm">
                    복원 전
                  </div>

                  {/* After Image (clipped) overlay */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                    }}
                  >
                    <img
                      src={selectedItem.afterSrc}
                      alt="복원 후"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* After Label */}
                  <div
                    className="absolute top-3 z-10 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-md backdrop-blur-sm"
                    style={{ left: `calc(${sliderPosition}% - 40px)` }}
                  >
                    복원 후
                  </div>

                  {/* Slider Line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-lg z-20 pointer-events-none"
                    style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
                  />

                  {/* Slider Handle */}
                  <SliderHandle
                    size="md"
                    style={{ left: `${sliderPosition}%` }}
                  />
                </div>
              )}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3">
              슬라이더를 좌우로 드래그하여 복원 전후를 비교해보세요
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}