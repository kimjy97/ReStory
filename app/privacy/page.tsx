import Link from "next/link"
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, AlertTriangle, Clock, Mail } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function PrivacyPolicy() {
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
                <Shield className="w-5 h-5 text-blue-600" />
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">개인정보처리방침</h1>
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
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">개인정보처리방침</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">최종 업데이트: 2024년 1월 1일</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              ReStory는 개인 개발자가 운영하는 AI 사진 복원 서비스입니다. 사용자의 개인정보를 소중히 여기며,
              개인정보보호법에 따라 개인정보를 안전하게 처리하고 있습니다.
            </p>
          </div>

          {/* 각 섹션 */}
          <div className="space-y-6">
            {/* 섹션 1 */}
            <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">개인정보의 처리목적</h3>
              </div>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>ReStory는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>서비스 제공:</strong> AI 사진 복원 서비스 제공
                  </li>
                  <li>
                    <strong>서비스 개선:</strong> 서비스 품질 향상을 위한 분석
                  </li>
                  <li>
                    <strong>기술 지원:</strong> 서비스 이용 중 발생하는 문제 해결
                  </li>
                </ul>
              </div>
            </section>

            {/* 섹션 2 */}
            <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">처리하는 개인정보 및 보유기간</h3>
              </div>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    처리하는 개인정보
                  </h4>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>업로드된 이미지 파일 (사진 복원 목적)</li>
                    <li>IP 주소 (서비스 이용 기록)</li>
                    <li>쿠키 정보 (서비스 개선 목적)</li>
                  </ul>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200/50 dark:border-amber-700/50">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    보유기간
                  </h4>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>
                      <strong>업로드된 이미지:</strong> 처리 완료 후 즉시 삭제
                    </li>
                    <li>
                      <strong>복원된 이미지:</strong> 24시간 후 자동 삭제
                    </li>
                    <li>
                      <strong>접속 로그:</strong> 30일 보관 후 삭제
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 섹션 3 */}
            <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">개인정보의 제3자 제공</h3>
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200/50 dark:border-green-700/50">
                  <p className="font-semibold text-green-800 dark:text-green-300">
                    ✅ ReStory는 사용자의 개인정보를 제3자에게 제공하지 않습니다.
                  </p>
                  <p className="text-sm mt-2 text-green-700 dark:text-green-400">
                    단, 법령의 규정에 의거하거나 수사기관의 요구가 있는 경우에는 관련 법령에 따라 제공할 수 있습니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 섹션 4 */}
            <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">개인정보처리의 위탁</h3>
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                <p className="mb-3">ReStory는 서비스 제공을 위해 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-600">
                        <th className="text-left py-2">위탁받는 자</th>
                        <th className="text-left py-2">위탁업무 내용</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 dark:border-gray-600">
                        <td className="py-2">Google (Gemini API)</td>
                        <td className="py-2">AI 이미지 처리 및 복원</td>
                      </tr>
                      <tr>
                        <td className="py-2">Vercel</td>
                        <td className="py-2">웹 서비스 호스팅</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 섹션 5 */}
            <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">정보주체의 권리</h3>
              </div>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>사용자는 다음과 같은 권리를 행사할 수 있습니다:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>개인정보 처리정지 요구</li>
                  <li>개인정보 열람 요구</li>
                  <li>개인정보 정정·삭제 요구</li>
                </ul>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-700/50 mt-4">
                  <p className="text-sm">
                    <strong>권리 행사 방법:</strong> poot972@gmail.com로 이메일을 보내주시면 신속히 처리해드립니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 섹션 6 */}
            <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">개인정보의 안전성 확보조치</h3>
              </div>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200/50 dark:border-green-700/50">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">기술적 조치</h4>
                    <ul className="text-sm space-y-1">
                      <li>• HTTPS 암호화 통신</li>
                      <li>• 이미지 자동 삭제 시스템</li>
                      <li>• 접근 로그 모니터링</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">관리적 조치</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 개인 개발자 단독 관리</li>
                      <li>• 정기적인 보안 점검</li>
                      <li>• 최소한의 데이터 수집</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 섹션 7 */}
            <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">개인정보 보호책임자</h3>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <div className="text-sm">
                  <h4 className="font-semibold mb-2">개인정보 보호책임자</h4>
                  <ul className="space-y-1">
                    <li>
                      <strong>성명:</strong> Croni (개인 개발자)
                    </li>
                    <li>
                      <strong>연락처:</strong> poot972@gmail.com
                    </li>
                    <li>
                      <strong>처리시간:</strong> 평일 기준 1-2일 내 답변
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* 하단 연락처 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mt-8 border border-blue-200/50 dark:border-blue-700/50">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">문의사항이 있으신가요?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                개인정보 처리에 관한 문의사항이 있으시면 언제든지 연락해 주세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:poot972@gmail.com"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" />
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
