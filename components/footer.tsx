"use client"

import Link from "next/link"
import { Mail, Shield, FileText } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-28 relative z-10 select-none">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-3">
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
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 hover:underline"
                >
                  <Shield className="w-3.5 h-3.5" />
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="mt-8 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} ReStory by Croni. All rights reserved.
            </div>

            <div className="flex items-center gap-4">
              <a
                href="mailto:poot972@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/team-croni"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}