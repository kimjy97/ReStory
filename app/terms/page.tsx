import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, XCircle, Scale } from "lucide-react"
import { Header } from "@/components/sub-haeder"

export const metadata: Metadata = {
  title: "이용약관 | ReStory",
  description: "ReStory 사진 복원 서비스의 이용규정 및 약관을 상세히 안내해 드립니다.",
}

export default function TermsOfService() {
  return (
    <div className="select-none">
      <Header title="이용약관" Icon={FileText} />

      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="space-y-8">
          {/* Intro Section */}
          <div className="bg-card border border-border rounded p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary text-foreground rounded flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground uppercase tracking-tight">서비스 이용약관</h2>
                <p className="text-xs text-muted-foreground font-mono">최종 업데이트: 2026년 5월 27일</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              본 약관은 개인 개발자 Croni가 운영하는 ReStory 서비스를 이용하는 모든 사용자에게 적용되는 이용조건을
              규정합니다.
            </p>
          </div>

          {/* Quick Summary Grid */}
          <div className="bg-card border border-border rounded p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">서비스 핵심 요약</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-muted border border-border p-4 rounded space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <h4 className="font-bold text-foreground uppercase">100% 무료 제공</h4>
                </div>
                <p className="text-muted-foreground">AI 이미지 복원 서비스는 아무런 대가 없이 무료로 제공됩니다.</p>
              </div>
              <div className="bg-muted border border-border p-4 rounded space-y-1.5">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-primary" />
                  <h4 className="font-bold text-foreground uppercase">개인 프로젝트</h4>
                </div>
                <p className="text-muted-foreground">개인 개발자가 운영하는 비상업적 학습 및 포트폴리오 프로젝트입니다.</p>
              </div>
              <div className="bg-muted border border-border p-4 rounded space-y-1.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  <h4 className="font-bold text-foreground uppercase">콘텐츠 제한</h4>
                </div>
                <p className="text-muted-foreground">부적절하거나 저작권을 침해하는 유해 이미지 업로드는 금지됩니다.</p>
              </div>
            </div>
          </div>

          {/* Content Chapters */}
          <div className="space-y-6">
            {/* Chapter 1 */}
            <section className="bg-card border border-border rounded p-6 space-y-3">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                제1조 (목적 및 서비스 소개)
              </h3>
              <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                <p>ReStory는 개인 개발자 Croni가 제작한 AI 기반 사진 복원 서비스입니다.</p>
                <p>본 서비스는 사용자가 디지털 캔버스에 업로드한 아날로그 및 훼손 이미지 파일을 최신 AI 모델을 사용하여 결함 제거 및 고화질 채색 복원을 지원하는 연구 성격의 무상 도구입니다.</p>
              </div>
            </section>

            {/* Chapter 2 */}
            <section className="bg-card border border-border rounded p-6 space-y-3">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                제2조 (서비스 제공)
              </h3>
              <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                <p>사용자에게 제공되는 디지털 솔루션 범위는 다음과 같습니다:</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2 font-medium">
                  <li>인공지능(AI) 기술 기반의 옛날 사진 복원 및 자연스러운 채색 처리</li>
                  <li>복원이 완료된 고화질 결과물의 로컬 다운로드 지원</li>
                </ul>
                <div className="bg-muted border border-border p-4 rounded mt-4">
                  <p className="font-mono text-[11px]">
                    <strong>참고사항:</strong> 본 인프라는 개인 소규모 클라우드 자원으로 구성되어 있어, 트래픽 폭주 시 작업이 일시적으로 보류되거나 차단될 수 있습니다.
                  </p>
                </div>
              </div>
            </section>

            {/* Chapter 3 */}
            <section className="bg-card border border-border rounded p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                제3조 (이용자의 의무 및 제한)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-muted border border-border p-4 rounded space-y-2">
                  <h4 className="font-bold text-destructive uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" />
                    엄격 금지 사항
                  </h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• 적법한 저작권이 없는 이미지 업로드</li>
                    <li>• 외설적, 폭력적, 혐오감을 유발하는 매체 유포</li>
                    <li>• 자동 크롤러를 동반한 대량 복원 요청 오용</li>
                    <li>• 복원 기능을 사적 영리를 도모하는 상업 행위에 대량 사용</li>
                  </ul>
                </div>
                <div className="bg-muted border border-border p-4 rounded space-y-2">
                  <h4 className="font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    권장 운영 지침
                  </h4>
                  <ul className="space-y-1 text-muted-foreground font-semibold">
                    <li>• 온전히 본인 및 소유가 확인된 사진만 취급</li>
                    <li>• 이미지 업로드 권장 규격 준수 (최대 10MB)</li>
                    <li>• 시스템 결함 발견 시 개발 주체에게 자발적 통보</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Chapter 4 */}
            <section className="bg-card border border-border rounded p-6 space-y-3">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                제4조 (저작권 및 법적 책임)
              </h3>
              <div className="text-xs text-muted-foreground leading-relaxed space-y-2">
                <ul className="list-disc list-inside space-y-1.5 ml-2 font-medium">
                  <li>사용자가 제공한 원본 이미지의 지식재산권은 일체 사용자 본인에게 유보됩니다.</li>
                  <li>AI 모델이 생성하여 변형을 거친 복원 결과물의 권리 및 소유 역시 원본 제공자에게 귀속됩니다.</li>
                  <li>본 서비스는 결과물에 대한 저작권 보장이나 라이선스 중개를 대행하지 않으며, 무단 업로드로 생기는 타인의 저작권 침해 분쟁은 전적으로 사용자의 귀책 사유가 됩니다.</li>
                </ul>
              </div>
            </section>

            {/* Chapter 5 */}
            <section className="bg-card border border-border rounded p-6 space-y-3">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                제5조 (면책 조항)
              </h3>
              <div className="text-xs text-muted-foreground leading-relaxed space-y-3">
                <p>본 도구는 완전한 무상 개인 포트폴리오 서비스로 제공되므로 다음 장애에 대해서 책임을 물을 수 없습니다:</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2 font-semibold text-foreground">
                  <li>일시적 서버 다운, 클라우드 호스트 이탈로 인한 복원 지연 및 정단</li>
                  <li>생성형 모델 특유의 왜곡 현상으로 결과물이 사용자의 기대를 충족하지 못하는 경우</li>
                  <li>연동 중인 외부 클라우드 및 인공지능 인프라 서비스의 불완전성</li>
                </ul>
                <div className="bg-muted border border-border p-4 rounded">
                  <p className="font-mono text-[11px] text-muted-foreground">
                    <strong>요약:</strong> 본 도구는 학술 연구 및 포트폴리오 공개물로, 결과물 가공에 대한 보증이나 사업적 완성 의무를 담보하지 않습니다.
                  </p>
                </div>
              </div>
            </section>

            {/* Chapter 6 */}
            <section className="bg-card border border-border rounded p-6 space-y-3">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                제6조 (약관 변경 및 연락처)
              </h3>
              <div className="text-xs text-muted-foreground leading-relaxed space-y-3">
                <p>운영상의 효율화를 기하기 위해 본 이용 규칙의 세부 조항은 별도 공지 없이 수정될 수 있으며, 개정 사항은 본 웹페이지에 게재되는 즉시 효력을 발휘합니다.</p>
                <div className="bg-muted border border-border p-4 rounded font-mono text-[11px]">
                  <strong>신고 및 건의 수렴:</strong> poot972@gmail.com (개발자 Croni)
                </div>
              </div>
            </section>
          </div>

          {/* Bottom Action Card */}
          <div className="border border-border rounded p-6 text-center space-y-4 bg-muted">
            <h3 className="text-base font-black text-foreground uppercase tracking-tight">이용약관 추가 접수</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              이용 조약에 대해 이의 제기가 있거나 기능 남용과 관련해 논의가 필요하신 경우 아래 개발자 연락망을 사용해주시기 바랍니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <a
                href="mailto:poot972@gmail.com"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold px-4 py-2 rounded transition-colors shadow-none"
              >
                <FileText className="w-3.5 h-3.5" />
                poot972@gmail.com
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 border border-border hover:bg-accent text-xs font-bold px-4 py-2 rounded transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
