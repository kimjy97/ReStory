import Link from "next/link"
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, AlertTriangle, Clock, Mail } from "lucide-react"
import { Header } from "@/components/sub-haeder"

export default function PrivacyPolicy() {
  return (
    <div className="select-none">
      <Header title="개인정보처리방침" Icon={Shield} />

      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="space-y-8">
          {/* Header Card */}
          <div className="bg-card border border-border rounded p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary text-foreground rounded flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground uppercase tracking-tight">개인정보처리방침</h2>
                <p className="text-xs text-muted-foreground font-mono">최종 업데이트: 2026년 5월 27일</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ReStory는 개인 개발자가 운영하는 AI 사진 복원 서비스입니다. 사용자의 개인정보를 소중히 여기며,
              개인정보보호법에 따라 개인정보를 안전하게 처리하고 있습니다.
            </p>
          </div>

          {/* Core Content Sections */}
          <div className="space-y-6">
            {/* Section 1 */}
            <section className="bg-card border border-border rounded p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                1. 개인정보의 처리목적
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                <p>ReStory는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2 font-medium">
                  <li><strong className="text-foreground">서비스 제공:</strong> Cloudflare Workers AI 기반 사진 복원 서비스 제공</li>
                  <li><strong className="text-foreground">서비스 개선:</strong> 비식별 통계를 통한 품질 개선 분석</li>
                  <li><strong className="text-foreground">기술 지원:</strong> 서비스 이용 중 발생하는 오류 처리 및 문의 대응</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-card border border-border rounded p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                2. 처리하는 개인정보 및 보유기간
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-muted border border-border p-4 rounded space-y-2">
                  <h4 className="font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-primary" />
                    수집 및 처리 항목
                  </h4>
                  <ul className="list-disc list-inside space-y-1 ml-1 text-muted-foreground">
                    <li>업로드된 원본 이미지 파일</li>
                    <li>IP 주소 및 기본 접속 브라우저 기록</li>
                    <li>쿠키 정보 (시스템 기능 지원용)</li>
                  </ul>
                </div>
                <div className="bg-muted border border-border p-4 rounded space-y-2">
                  <h4 className="font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    보유 및 삭제 시점
                  </h4>
                  <ul className="list-disc list-inside space-y-1 ml-1 text-muted-foreground font-semibold">
                    <li><span className="text-foreground">업로드 이미지:</span> 처리 직후 서버 메모리 즉시 영구 파기</li>
                    <li><span className="text-foreground">복원된 이미지:</span> 세션 완료 시점 즉시 삭제</li>
                    <li><span className="text-foreground">시스템 접속 로그:</span> 최대 30일 보관 후 일괄 소멸</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-card border border-border rounded p-6 space-y-3">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                3. 개인정보의 제3자 제공
              </h3>
              <div className="bg-muted border border-border p-4 rounded text-xs text-muted-foreground leading-relaxed font-medium">
                <p className="font-bold text-foreground uppercase mb-1">
                  ✓ ReStory는 사용자의 개인정보를 제3자에게 절대 제공하지 않습니다.
                </p>
                <p>
                  단, 법령의 특별한 규정에 의거하거나 수사기관의 공식적인 요구가 있는 등 법률적 의무 이행을 위해서 필요한 경우에 한하여 예외적으로 제공될 수 있습니다.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-card border border-border rounded p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                4. 개인정보처리의 위탁
              </h3>
              <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                <p>ReStory는 서비스 연동 및 인프라 처리를 위해 아래 기업에 서비스 일부를 위탁하고 있습니다:</p>
                <div className="border border-border rounded overflow-hidden">
                  <table className="w-full text-[11px] font-mono">
                    <thead>
                      <tr className="bg-muted border-b border-border text-foreground font-bold text-left">
                        <th className="py-2.5 px-3">수탁 기관</th>
                        <th className="py-2.5 px-3">위탁 업무 상세</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-foreground">Cloudflare, Inc.</td>
                        <td className="py-2.5 px-3">Workers AI API를 통한 안정적 이미지 복원 처리</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-foreground">Vercel, Inc.</td>
                        <td className="py-2.5 px-3">서버리스 클라우드 인프라 호스팅 및 도메인 제공</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-card border border-border rounded p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                5. 정보주체의 권리 행사
              </h3>
              <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                <p>사용자는 언제든지 자신의 개인정보에 대해 처리정지, 열람 및 정정·삭제를 요구할 권리를 가집니다.</p>
                <div className="bg-muted border border-border p-4 rounded font-mono text-[11px]">
                  <strong>권리 권한 접수처:</strong> poot972@gmail.com (요청 시 1~2영업일 이내 즉각 삭제 조치 완료)
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-card border border-border rounded p-6 space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                6. 개인정보의 보호 노력
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-muted border border-border p-3 rounded">
                  <h4 className="font-bold text-foreground mb-1.5 uppercase tracking-wider">기술적 보호</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• 전 구간 HTTPS 보안 웹 통신 암호화</li>
                    <li>• 임시 버퍼 이미지 영구 즉시 소멸 처리</li>
                    <li>• API 라우트 상시 암호화 검증</li>
                  </ul>
                </div>
                <div className="bg-muted border border-border p-3 rounded">
                  <h4 className="font-bold text-foreground mb-1.5 uppercase tracking-wider">관리적 보호</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• 개발 주체 단독 집중 액세스 관리</li>
                    <li>• 정기 웹 방화벽 인프라 점검</li>
                    <li>• 불필요 데이터 일절 비수집 원칙</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Bottom Action Card */}
          <div className="border border-border rounded p-6 text-center space-y-4 bg-muted">
            <h3 className="text-base font-black text-foreground uppercase tracking-tight">추가 문의사항 접수</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              ReStory의 개인정보 취급 방침에 관하여 의문점이 있거나 피드백이 있으시다면 하단의 담당 개발자 이메일로 메일을 보내주시기 바랍니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <a
                href="mailto:poot972@gmail.com"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold px-4 py-2 rounded transition-colors shadow-none"
              >
                <Mail className="w-3.5 h-3.5" />
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
