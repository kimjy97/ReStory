"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Send, CheckCircle, AlertCircle, MessageSquare, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/sub-haeder"

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

    // Generate mailto link
    const subject = encodeURIComponent(`[ReStory 문의] ${formData.subject}`)
    const body = encodeURIComponent(`
안녕하세요, ReStory 개발자님!

이름: ${formData.name}
이메일: ${formData.email}

문의 내용:
${formData.message}

---
ReStory 문의 양식에서 자동 생성됨
    `)

    const mailtoLink = `mailto:poot972@gmail.com?subject=${subject}&body=${body}`

    // Open email client in a new window
    window.open(mailtoLink, "_blank")

    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus("success")
    }, 1000)
  }

  const isFormValid = formData.name && formData.email && formData.subject && formData.message

  return (
    <div className="select-none">
      <Header title="문의하기" Icon={Mail} />

      <main className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="space-y-8">
          {/* Header Description */}
          <div className="bg-card border border-border rounded p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary text-foreground rounded flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground uppercase tracking-tight">문의하기</h2>
                <p className="text-xs text-muted-foreground font-mono">궁금한 점이나 제안사항을 알려주세요</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ReStory 서비스에 대한 문의사항, 버그 신고, 개선 제안 등 어떤 내용이든 환영합니다. 개인 개발자가 운영하는
              서비스이므로 답변까지 1-2일 정도 소요될 수 있습니다.
            </p>
          </div>

          {/* Quick Mail Trigger */}
          <div className="bg-card border border-border rounded p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">이메일 바로 전송</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:poot972@gmail.com"
                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold px-4 py-2.5 rounded transition-colors flex-1 justify-center shadow-none"
              >
                <Mail className="w-4 h-4" />
                poot972@gmail.com
              </a>
              <div className="text-xs text-muted-foreground flex items-center justify-center font-semibold">
                또는 하단의 온라인 양식을 작성해주세요
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-card border border-border rounded p-6">
            {submitStatus === "success" ? (
              <div className="text-center py-8 space-y-6 animate-in fade-in duration-300">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">문의 사항 전송 준비 완료</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    이메일 클라이언트(메일 앱) 창이 성공적으로 열렸습니다. 열린 창에서 최종 전송 버튼을 누르시면 접수가 완료됩니다.
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => {
                      setSubmitStatus("idle")
                      setFormData({ name: "", email: "", subject: "", message: "" })
                    }}
                    variant="outline"
                    className="border-border hover:bg-accent text-xs font-bold rounded shadow-none"
                  >
                    새 문의 작성하기
                  </Button>
                  <Link href="/">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold rounded shadow-none">
                      홈으로 이동
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                      보내는 이 이름 *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:border-primary font-medium"
                      placeholder="홍길동"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-primary" />
                      답변받을 이메일 *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:border-primary font-medium"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    문의 분류 범주 *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:border-primary font-semibold"
                  >
                    <option value="">분류를 선택해주세요</option>
                    <option value="서비스 이용 문의">서비스 이용 문의</option>
                    <option value="광고 제휴 문의">광고 제휴 문의</option>
                    <option value="시스템 버그 신고">시스템 버그 신고</option>
                    <option value="성능 개선 제안">성능 개선 제안</option>
                    <option value="기타 일반 건의">기타 일반 건의</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    구체적 문의 내용 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:border-primary resize-none font-medium leading-relaxed"
                    placeholder="문의하실 애로사항이나 건의 내용을 자세히 기재해주시기 바랍니다."
                  />
                </div>

                <div className="bg-muted border border-border p-4 rounded space-y-2">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-primary" />
                    제출 시 주의사항
                  </h4>
                  <ul className="text-[11px] text-muted-foreground space-y-1 list-disc list-inside">
                    <li>개인 프로젝트 특성상 신속 답변이 어려울 수 있습니다. (1~2일 소요)</li>
                    <li>버그 제보 시 장애가 발견된 브라우저(Chrome, Safari 등)와 환경을 동봉해주십시오.</li>
                    <li>수집된 인적 사항은 본 문의에 대한 회신 용도 외에는 전량 보관되지 않습니다.</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/95 font-bold py-3 rounded shadow-none border-0 transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                      양식 처리 중...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      문의 메일 작성하기
                    </div>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* FAQ Accordion Style Card */}
          <div className="bg-card border border-border rounded p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">자주 기재되는 질문</h3>
            <div className="space-y-4 divide-y divide-border text-xs leading-relaxed">
              <div className="pb-3 space-y-1">
                <h4 className="font-bold text-foreground">Q. 이미지 자동 삭제 조건은 어떻게 되나요?</h4>
                <p className="text-muted-foreground">
                  서버 부하 및 보안 유지를 위하여 세션 만료 즉시 혹은 최대 24시간 이내에 생성된 파일은 백서버에서 완전 파기됩니다.
                </p>
              </div>
              <div className="pt-3 pb-3 space-y-1">
                <h4 className="font-bold text-foreground">Q. 모바일 브라우저에서도 문제없이 이용이 가능한가요?</h4>
                <p className="text-muted-foreground">
                  예, 모바일 터치 및 스크롤을 고려해 인터랙션 슬라이더를 포함한 전체 요소가 완전한 반응형 디자인으로 설계되었습니다.
                </p>
              </div>
              <div className="pt-3 space-y-1">
                <h4 className="font-bold text-foreground">Q. 상업적 목적으로 활용이 가능합니까?</h4>
                <p className="text-muted-foreground">
                  본 서비스는 비상업 포트폴리오로, 복원 퀄리티 및 가용 자원에 보증이 따르지 않으므로 개인적 소장 용도 이외의 대형 상업적 활용은 권장하지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
