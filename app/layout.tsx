import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "무료 사진 복원 서비스 - AI로 옛날 사진 복원",
  description: "AI 기술로 손상된 옛날 사진을 무료로 전문적으로 복원해드립니다",
  keywords: ["무료사진복원", "사진복원", "AI", "이미지복원", "옛날사진", "사진수리"],
  authors: [{ name: "Photo Restoration Service" }],
  themeColor: '#2563eb',
  manifest: "/manifest.json",
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
    apple: [{ url: "/favicon_196.png", sizes: "196x196", type: "image/png" }],
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
        <meta name="google-adsense-account" content="ca-pub-6382459265682013" />
        <meta name="google-site-verification" content="a2fgyHnx6CNoDmHMVOuzQTV4DQqn7a-WQkMF8YNLXvw" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 relative overflow-hidden">
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
