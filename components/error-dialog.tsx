"use client"

import { AlertTriangle, RefreshCw, Mail, Clock, Shield, Wifi, Server, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorDialogProps {
  isOpen: boolean
  onClose: () => void
  error: {
    message: string
    type?: string
    details?: string
    suggestions?: string[]
  }
  onRetry?: () => void
}

export function ErrorDialog({ isOpen, onClose, error, onRetry }: ErrorDialogProps) {
  if (!isOpen) return null

  const getErrorIcon = (type?: string) => {
    switch (type) {
      case "QUOTA_EXCEEDED":
        return <Clock className="w-8 h-8 text-amber-500" />
      case "SAFETY_ERROR":
        return <Shield className="w-8 h-8 text-red-500" />
      case "NETWORK_ERROR":
        return <Wifi className="w-8 h-8 text-blue-500" />
      case "TIMEOUT_ERROR":
        return <Clock className="w-8 h-8 text-orange-500" />
      case "CONFIG_ERROR":
      case "AI_INIT_ERROR":
      case "AI_SERVICE_ERROR":
        return <Server className="w-8 h-8 text-purple-500" />
      default:
        return <AlertTriangle className="w-8 h-8 text-red-500" />
    }
  }

  const getErrorTitle = (type?: string) => {
    switch (type) {
      case "QUOTA_EXCEEDED":
        return "일일 사용량 초과"
      case "SAFETY_ERROR":
        return "안전 정책 위배"
      case "NETWORK_ERROR":
        return "네트워크 오류"
      case "TIMEOUT_ERROR":
        return "처리 시간 초과"
      case "CONFIG_ERROR":
        return "서버 설정 오류"
      case "AI_INIT_ERROR":
        return "AI 서비스 오류"
      case "AI_SERVICE_ERROR":
        return "AI 서비스 일시 중단"
      case "VALIDATION_ERROR":
        return "입력 오류"
      default:
        return "오류 발생"
    }
  }

  const getErrorSolution = (type?: string) => {
    switch (type) {
      case "QUOTA_EXCEEDED":
        return ["내일 다시 시도해주세요", "개인 프로젝트로 일일 사용량이 제한되어 있습니다"]
      case "SAFETY_ERROR":
        return ["다른 이미지를 업로드해주세요", "개인정보나 부적절한 내용이 포함된 이미지는 처리할 수 없습니다"]
      case "NETWORK_ERROR":
        return ["인터넷 연결을 확인해주세요", "잠시 후 다시 시도해주세요"]
      case "TIMEOUT_ERROR":
        return ["이미지 크기를 줄여서 다시 시도해주세요", "서버가 바쁠 수 있으니 잠시 후 다시 시도해주세요"]
      case "CONFIG_ERROR":
      case "AI_INIT_ERROR":
        return ["서버에 일시적인 문제가 발생했습니다", "잠시 후 다시 시도하거나 관리자에게 문의해주세요"]
      case "AI_SERVICE_ERROR":
        return [
          "AI 서비스에 일시적인 문제가 있습니다",
          "5-10분 후 다시 시도해주세요",
          "이미지 크기를 줄여서 시도해보세요",
        ]
      default:
        return ["잠시 후 다시 시도해주세요", "문제가 계속되면 관리자에게 문의해주세요"]
    }
  }

  const canRetry = !["QUOTA_EXCEEDED", "SAFETY_ERROR", "CONFIG_ERROR"].includes(error.type || "")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 max-w-md mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            {getErrorIcon(error.type)}
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{getErrorTitle(error.type)}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{error.message}</p>
        </div>

        {/* Solutions */}
        <div className="px-6 pb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200/50 dark:border-blue-700/50">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">해결 방법</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              {(error.suggestions || getErrorSolution(error.type)).map((solution, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Additional suggestions for AI service errors */}
        {error.type === "AI_SERVICE_ERROR" && (
          <div className="px-6 pb-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200/50 dark:border-amber-700/50">
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                추가 팁
              </h4>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>• 이미지 크기: 1-2MB 이하 권장</li>
                <li>• 파일 형식: JPG 또는 PNG</li>
                <li>• 복원 스타일: 한 번에 1-2개만 선택</li>
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          {canRetry && onRetry && (
            <Button onClick={onRetry} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              다시 시도
            </Button>
          )}
          <Button onClick={onClose} variant="outline" className={canRetry ? "flex-1" : "w-full"}>
            확인
          </Button>
        </div>

        {/* Contact Info for Server Errors */}
        {["CONFIG_ERROR", "AI_INIT_ERROR", "AI_SERVICE_ERROR", "UNKNOWN_ERROR"].includes(error.type || "") && (
          <div className="px-6 pb-6 pt-0">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">문제가 계속되면 관리자에게 문의해주세요</p>
              <a
                href="mailto:poot972@gmail.com"
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Mail className="w-3 h-3" />
                poot972@gmail.com
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
