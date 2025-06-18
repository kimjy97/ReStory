"use client"

import Link from "next/link"
import { Mail, Shield, FileText } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 mt-20">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 브랜드 섹션 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                ReStory
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              AI 기술로 소중한 추억을 되살리는 사진 복원 서비스
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Made by Croni</span>
            </div>
          </div>

          {/* 서비스 정보 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  AI 사진 복원
                </Link>
              </li>
              <li className="text-gray-500 dark:text-gray-500 text-xs">무료 서비스</li>
            </ul>
          </div>

          {/* 법적 정보 및 연락처 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">정보</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" />
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 구분선 및 저작권 */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 ReStory by Croni. All rights reserved.
            </div>

            {/* 테마 토글과 이메일 */}
            <div className="flex items-center gap-4">
              <a
                href="mailto:poot972@gmail.com"
                className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-lg">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
