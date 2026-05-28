import React from "react"
import { ChevronsLeftRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SliderHandleProps {
  className?: string
  style?: React.CSSProperties
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: {
    container: "w-10 h-10",
    icon: "w-4 h-4",
  },
  md: {
    container: "w-12 h-12",
    icon: "w-7 h-7",
  },
  lg: {
    container: "w-14 h-14",
    icon: "w-8 h-8",
  },
} as const

export function SliderHandle({
  className,
  style,
  size = "sm",
}: SliderHandleProps) {
  const { container, icon } = sizeMap[size]

  return (
    <div
      className={cn(
        "absolute top-1/2 z-30 -translate-y-1/2 -translate-x-1/2",
        "flex items-center justify-center",
        "bg-white/50 border border-primary text-primary-foreground",
        "rounded-full overflow-hidden",
        "pointer-events-none",
        "select-none",
        "slider-handler",
        container,
        className,
      )}
      style={style}
    >
      <ChevronsLeftRight strokeWidth={1.5} className={cn("shrink-0 z-10", icon)} />
    </div>
  )
}