"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Send, CheckCircle, AlertCircle, MessageSquare, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 실제 이메일 전송 로직 대신 mailto 링크 생성
    const subject = encodeURIComponent(`[ReStory 문의] ${formData.subject}`)
    const body = encodeURIComponent(`
안녕하세요, ReStory 개발자님!

이름: ${formData.name}
이메일: ${formData.email}

문의 내용:
${formData.message}

---
ReStory 문의하기 폼에서 전송됨
    `)

    const mailtoLink = `mailto:poot972@gmail.com?subject=${subject}&body=${body}`

    // 새 창에서 이메일 클라이언트 열기
    window.open(mailtoLink, "_blank")

    // 성공 상태로 변경
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus("success")
    }, 1000)
  }

  const isFormValid = formData.name && formData.email && formData.subject && formData.message

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">홈으로 돌아가기</span>
              </Link>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">문의하기</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* 소개 섹션 */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">문의하기</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">궁금한 점이나 제안사항을 알려주세요</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              ReStory 서비스에 대한 문의사항, 버그 신고, 개선 제안 등 어떤 내용이든 환영합니다. 개인 개발자가 운영하는
              서비스이므로 답변까지 1-2일 정도 소요될 수 있습니다.
            </p>
          </div>

          {/* 빠른 연락처 */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">빠른 연락</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:poot972@gmail.com"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex-1 justify-center"
              >
                <Mail className="w-4 h-4" />
                poot972@gmail.com
              </a>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
                또는 아래 폼을 작성해주세요
              </div>
            </div>
          </div>

          {/* 문의 폼 */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
            {submitStatus === "success" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">문의가 전송되었습니다!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  이메일 클라이언트가 열렸습니다. 메일을 확인하고 전송해주세요.
                  <br />
                  1-2일 내에 답변드리겠습니다.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => {
                      setSubmitStatus("idle")
                      setFormData({ name: "", email: "", subject: "", message: "" })
                    }}
                    variant="outline"
                  >
                    새 문의 작성
                  </Button>
                  <Link href="/">
                    <Button>홈으로 돌아가기</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      이름 *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      이메일 *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    문의 유형 *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">문의 유형을 선택해주세요</option>
                    <option value="서비스 이용 문의">서비스 이용 문의</option>
                    <option value="버그 신고">광고 문의</option>
                    <option value="버그 신고">버그 신고</option>
                    <option value="기능 개선 제안">기능 개선 제안</option>
                    <option value="기술적 문제">기술적 문제</option>
                    <option value="기타 문의">기타 문의</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    문의 내용 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="문의하실 내용을 자세히 적어주세요. 버그 신고의 경우 발생 상황과 사용 환경을 함께 알려주시면 도움이 됩니다."
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      <p className="font-semibold mb-1">안내사항</p>
                      <ul className="space-y-1 text-xs">
                        <li>• 개인 개발자가 운영하는 서비스로 답변까지 1-2일 소요될 수 있습니다</li>
                        <li>• 버그 신고 시 브라우저 종류와 버전을 함께 알려주세요</li>
                        <li>• 개인정보는 문의 처리 목적으로만 사용됩니다</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg shadow-xl border-0 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      전송 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      문의 전송하기
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* FAQ 섹션 */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">자주 묻는 질문</h3>
            <div className="space-y-4">
              <div className="border-b border-gray-200 dark:border-gray-600 pb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Q. 복원된 이미지는 얼마나 보관되나요?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  복원된 이미지는 24시간 후 자동으로 삭제됩니다. 필요한 이미지는 즉시 다운로드해주세요.
                </p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-600 pb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Q. 어떤 이미지 형식을 지원하나요?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  JPG, PNG 형식을 지원하며, 파일 크기는 10MB 이하로 제한됩니다.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Q. 서비스 이용료가 있나요?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ReStory는 완전 무료 서비스이며, 별도의 이용료는 없습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
