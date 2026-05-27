import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_KR } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { Footer } from "@/components/footer"

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
})

export const viewport = {
  themeColor: "#5d3db5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "ReStory | 무료 옛날 사진 복원 - 빛바랜 추억을 선명하게",
  description: "빛바랜 가족사진, 먼지와 흠집으로 훼손된 옛날 사진을 고성능 AI 기술로 깨끗하고 자연스럽게 복원해 드립니다. 소중했던 순간의 기억을 선명하게 되살려보세요.",
  keywords: ["옛날사진복원", "사진복원", "무료사진복원", "흑백사진채색", "추억복원", "훼손사진복원", "부모님사진복원", "아날로그사진복원", "ReStory"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "추억복원 ReStory",
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
      <body className={notoSansKr.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between">
            <div>
              {children}
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
