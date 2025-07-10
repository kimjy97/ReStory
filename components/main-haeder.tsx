import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function Header() {
  return (
    <header className="h-[52px] flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">
                ReStory
              </h3>
            </div>
          </Link>
          <Button
            variant="default"
            size="sm"
            className="ml-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold shadow-lg border-0 transition-all duration-300"
            onClick={() => {
              // 커스텀 이벤트를 dispatch하여 메인 업로드 input을 트리거
              window.dispatchEvent(new Event("open-upload-input"));
            }}
          >
            <Upload className="w-4 h-4 mr-1" />
            사진 업로드
          </Button>
        </div>
      </div>
    </header>
  )
}