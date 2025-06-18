import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "무료 사진 복원 서비스 - AI로 옛날 사진 복원",
  description: "AI 기술로 손상된 옛날 사진을 무료로 전문적으로 복원해드립니다",
  keywords: ["무료사진복원", "사진복원", "AI", "이미지복원", "옛날사진", "사진수리"],
  authors: [{ name: "Photo Restoration Service" }],
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "사진복원",
  },
  icons: {
    icon: [
      { url: "/favicon_196.png", sizes: "196x196", type: "image/png" },
      { url: "/favicon_512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/favicon_192.png", sizes: "196x196", type: "image/png" }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="사진복원" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
