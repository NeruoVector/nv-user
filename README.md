# 교내 배달 사용자 웹

기존 Expo / React Native 사용자 앱을 **React + TypeScript + Vite** 기반 웹 앱으로 전환했습니다.
가입 안내, 매점 탐색, 상품·장바구니, 주문·배송 현황, 마이 페이지의 기존 흐름을 유지합니다.
모바일 폭에 맞춘 반응형 웹이며 브라우저에서 실행합니다.

## 실행

Node.js 22.13 이상이 필요합니다.

```bash
npm install
npm run dev
# http://127.0.0.1:5175
```

개발·preview 서버는 `/api`를 기본적으로 `https://neurovector-backend.forge-lang.org`로 전달합니다.
다른 서버는 `.env.local`에 지정하고 Vite를 재시작하세요.

```dotenv
NV_BACKEND=http://localhost:8081
```

기존 `EXPO_PUBLIC_BACKEND_BASE_URL`은 사용하지 않습니다. 배포 서버는 `/api`를 백엔드로
역방향 프록시해야 합니다. 다른 출처를 직접 호출할 경우 빌드 전에
`VITE_BACKEND_BASE_URL=https://...`을 지정하고 백엔드 CORS 허용 출처도 맞추세요.
React Router의 `/item/:id`, `/order/:id` 등을 새로고침할 수 있도록 배포 서버의
알 수 없는 화면 경로는 `index.html`로 fallback해야 합니다(API 경로는 제외).

## 구조

```text
src/main.tsx             React DOM 진입점 / BrowserRouter / StoreProvider
src/App.tsx              화면 경로 등록
src/pages/               사용자 화면
src/components/ui/app.tsx HTML 버튼·입력·카드·하단 메뉴
src/styles.css           모바일 레이아웃·공통 스타일
src/lib/navigation.ts    URL 매개변수와 화면 이동
src/lib/api.ts           TypeScript 백엔드 요청
src/lib/store.tsx        프로필·장바구니·상품 상태
```

프로필은 기존 `nv-profile` 키로 브라우저 localStorage에 저장합니다.
기존 모바일 기기의 AsyncStorage 데이터가 브라우저로 자동 이전되지는 않습니다.
학교 연결에 쓰는 개발용 코드는 `123456`입니다.

## 백엔드 연동 범위

- 재고 목록: `GET /api/v1/inventory`
- 주문 생성·목록·상세: `/api/v1/orders`
- 개발용 결제: `POST /api/v1/orders/{id}/payments`
- 주문 상세: 화면이 열려 있는 동안 15초 간격 갱신

휴대폰 인증, 학교 코드 조회, 사용자 세션, 알림 발송, 리뷰, 결제수단 저장 API는 백엔드에 없습니다.
프로필·알림 설정·최근 리뷰는 브라우저에만 저장합니다. 수령 확인도 해당 화면에서만 표시되며,
서버의 배송 상태는 배송 담당자가 변경합니다. 결제는 실제 과금이 아닌 개발용 결제입니다.

이번 변경은 웹 전환 범위입니다. 기존 주문·결제 재시도 복구와 재고 합산 제한은 별도 보완 과제입니다.

## 검증

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

`dist/`가 배포 산출물입니다. Expo Go, iOS·Android 빌드 명령은 사용하지 않습니다.
