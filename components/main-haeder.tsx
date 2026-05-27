import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export function Header() {
  return (
    <header className="h-[56px] flex items-center border-b border-border bg-background relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2">
              <img
                src="/favicon_512.png"
                alt="ReStory Logo"
                className="w-6 h-6 object-contain rounded-sm"
              />
              <h3 className="text-lg font-black tracking-tight text-foreground">
                ReStory
              </h3>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/95 font-bold shadow-none rounded border-0 transition-colors"
              onClick={() => {
                // Dispatch custom event to trigger main upload input
                window.dispatchEvent(new Event("open-upload-input"))
              }}
            >
              <Upload className="w-4 h-4 mr-1" />
              사진 업로드
            </Button>
            
            <div className="border-l border-border pl-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}