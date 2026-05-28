import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export function Header() {
  return (
    <header className="h-[56px] flex items-center relative z-50">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-1.5">
              <img
                src="/favicon_512.png"
                alt="ReStory Logo"
                className="w-7 h-7 object-contain"
              />
              <h3 className="text-xl font-medium tracking-tight text-foreground logo">
                ReStory
              </h3>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/95 shadow-none rounded-lg border-0 transition-colors"
              onClick={() => {
                // Dispatch custom event to trigger main upload input
                window.dispatchEvent(new Event("open-upload-input"))
              }}
            >
              <Upload className="w-4 h-4" />
              사진 업로드
            </Button>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}