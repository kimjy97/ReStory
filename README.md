# 📸 ReStory - AI 사진 복원 서비스

손상된 사진을 AI로 복원해주는 무료 웹 서비스입니다. Google Gemini AI를 활용해 보수적/모던/하이브리드 스타일의 복원 결과를 제공하며, 직관적인 비교 UI와 다양한 사용자 편의 기능을 갖추고 있습니다.
🔗 [사이트 바로가기](https://restory-free.vercel.app) ｜ [GitHub 바로가기](https://github.com/kimjy97/ReStory)

<img width="2048" height="1127" alt="restory_preview" src="https://github.com/user-attachments/assets/45bf9b71-0ef7-4385-9dfb-9b22b45f3110" />


## ✨ 주요 기능

* 🧠 Gemini AI 기반 손상 사진 복원 (보수적/모던/하이브리드 스타일)
* 📂 드래그 앤 드롭 파일 업로드 및 타입/크기 검증 (최대 10MB)
* 🪞 복원 전후 이미지 비교 뷰어 (확대/다운로드 지원)
* 🖼️ JPG/PNG 등 다양한 이미지 포맷 지원
* 💡 실시간 복원 진행 상태 및 에러 안내
* 🌗 다크모드 및 PWA 지원 (모바일 대응 포함)

## 🛠 기술 스택

* **Frontend**: Next.js, React, TypeScript, TailwindCSS
* **UI 라이브러리**: Radix UI
* **AI 모델 연동**: Google Gemini API
* **배포**: Vercel

## 💡 핵심 기능 설명

### AI 사진 복원 시스템

* Google Gemini Vision 모델을 활용한 외부 추론 기반 복원
* 복원 스타일별 프롬프트 구성: 보수적/모던/하이브리드 선택 제공
* 고해상도 이미지 지원 (서버 부하 제한을 위한 10MB 제한 적용)

### 직관적인 이미지 관리

* Drag & Drop 기반 업로드 및 미리보기
* 이미지 전후 비교 슬라이더 UI
* 이미지 확대/저장/재복원 기능 제공

### 사용자 경험 및 보안

* 복원 중/완료/실패 등 다양한 상태 안내 및 토스트 피드백
* 서버 임시 처리 후 이미지 자동 폐기 (개인정보 미저장)
* 파일 타입/사이즈 검증 및 개인정보 처리방침 제공

### 성능 및 접근성 최적화

* **PWA 지원**: 오프라인 접근 및 홈화면 설치 기능
* **반응형 웹 디자인**: 다양한 디바이스에 최적화된 UI
* **접근성 고려**: 명확한 피드백, 키보드 탐색 등 UI 개선
