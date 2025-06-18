import Link from "next/link"
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, XCircle, Scale } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function TermsOfService() {
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
                <FileText className="w-5 h-5 text-blue-600" />
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">이용약관</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 소개 섹션 */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">서비스 이용약관</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">최종 업데이트: 2025년 1월 1일</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              본 약관은 개인 개발자 Croni가 운영하는 ReStory 서비스를 이용하는 모든 사용자에게 적용되는 이용조건을
              규정합니다.
            </p>
          </div>

          {/* 주요 내용 요약 */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">주요 내용 요약</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200/50 dark:border-green-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-green-800 dark:text-green-300">무료 서비스</h4>
                </div>
                <p className="text-sm text-green-700 dark:text-green-400">AI 사진 복원 서비스는 무료로 제공됩니다.</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300">개인 프로젝트</h4>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  개인 개발자가 운영하는 비상업적 프로젝트입니다.
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200/50 dark:border-amber-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h4 className="font-semibold text-amber-800 dark:text-amber-300">이용 제한</h4>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  부적절한 콘텐츠 업로드 시 서비스 이용이 제한될 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 약관 내용 */}
          <div className="space-y-6">
            {/* 제1조 */}
            <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제1조 (목적 및 서비스 소개)</h3>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                <p>ReStory는 개인 개발자 Croni가 개발한 AI 기반 사진 복원 서비스입니다.</p>
                <p>본 서비스는 사용자가 업로드한 오래된 사진을 AI 기술을 활용하여 복원해드리는 무료 서비스입니다.</p>
              </div>
            </section>

            {/* 제2조 */}
            <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제2조 (서비스 제공)</h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>제공하는 서비스:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>AI 기반 사진 복원 (빈티지 보존, 모던 향상, 하이브리드 스타일)</li>
                  <li>복원된 이미지 다운로드</li>
                </ul>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-700/50 mt-4">
                  <p className="text-sm">
                    <strong>서비스 특징:</strong> 개인 프로젝트로 운영되며, 서버 상황에 따라 일시적으로 중단될 수
                    있습니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 제3조 */}
            <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제3조 (이용자의 의무)</h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200/50 dark:border-red-700/50">
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      금지 행위
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• 타인의 저작권을 침해하는 이미지 업로드</li>
                      <li>• 음란물, 폭력적 콘텐츠 업로드</li>
                      <li>• 서비스 남용 (과도한 요청 등)</li>
                      <li>• 상업적 목적의 대량 이용</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200/50 dark:border-green-700/50">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      권장 사항
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• 개인 소유의 사진만 업로드</li>
                      <li>• 적절한 크기의 이미지 사용 (10MB 이하)</li>
                      <li>• 서비스 개선을 위한 피드백 제공</li>
                      <li>• 다른 사용자를 위한 배려</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 제4조 */}
            <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제4조 (저작권 및 책임)</h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>업로드한 원본 이미지의 저작권은 사용자에게 있습니다.</li>
                  <li>복원된 이미지의 저작권도 사용자에게 있습니다.</li>
                  <li>사용자는 업로드하는 이미지에 대한 적법한 권리를 보유해야 합니다.</li>
                  <li>저작권 침해로 인한 모든 책임은 사용자에게 있습니다.</li>
                </ul>
              </div>
            </section>

            {/* 제5조 */}
            <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제5조 (면책조항)</h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>개인 프로젝트의 특성상 다음 사항에 대해 책임을 지지 않습니다:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>서버 장애, 네트워크 문제로 인한 서비스 중단</li>
                  <li>복원 결과의 품질 (최선을 다하나 완벽함을 보장하지 않음)</li>
                  <li>사용자의 부주의로 인한 데이터 손실</li>
                  <li>제3자 서비스(Google AI) 장애로 인한 문제</li>
                </ul>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200/50 dark:border-amber-700/50 mt-4">
                  <p className="text-sm">
                    <strong>참고:</strong> 본 서비스는 개인 개발자의 학습 및 포트폴리오 목적으로 제작되었습니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 제6조 */}
            <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">제6조 (약관 변경 및 연락처)</h3>
              <div className="text-gray-700 dark:text-gray-300 space-y-3">
                <p>서비스 개선을 위해 본 약관을 변경할 수 있으며, 변경 시 서비스 내에서 공지합니다.</p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                  <p className="text-sm">
                    <strong>문의 및 신고:</strong> poot972@gmail.com
                    <br />
                    <strong>개발자:</strong> Croni (개인 개발자)
                    <br />
                    <strong>응답 시간:</strong> 평일 기준 1-2일 내
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* 하단 연락처 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mt-8 border border-blue-200/50 dark:border-blue-700/50">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">궁금한 점이 있으신���요?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                서비스 이용에 관한 문의사항이 있으시면 언제든지 연락해 주세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:poot972@gmail.com"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  poot972@gmail.com
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  홈으로 돌아가기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
