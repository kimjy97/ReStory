"use client"

import Link from "next/link"
import { Mail, Shield, FileText } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-20 relative z-10 select-none">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/favicon_512.png"
                alt="ReStory Logo"
                className="w-6 h-6 object-contain rounded-sm"
              />
              <h3 className="text-base font-black tracking-tight text-foreground">
                ReStory
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI 기술로 소중한 추억을 되살리는 사진 복원 서비스
            </p>
            <div className="text-[10px] text-muted-foreground">
              Made by Croni
            </div>
          </div>

          {/* Service Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">서비스</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors hover:underline"
                >
                  AI 사진 복원
                </Link>
              </li>
              <li className="text-muted-foreground/60">무료 서비스</li>
            </ul>
          </div>

          {/* Legal and Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">정보</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 hover:underline"
                >
                  <Shield className="w-3.5 h-3.5" />
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="border-t border-border mt-8 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-muted-foreground">
              © 2025 ReStory by Croni. All rights reserved.
            </div>

            <div className="flex items-center gap-4">
              <a
                href="mailto:poot972@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
