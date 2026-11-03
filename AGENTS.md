# nv-user

React 웹 + TypeScript + Vite 프로젝트입니다. Expo / React Native 의존성은 사용하지 않습니다.

- 화면은 `src/pages`, 공통 HTML UI는 `src/components`, API·상태·라우팅 보조 함수는 `src/lib`에 둡니다.
- 라우팅은 React Router를 사용하며 `src/App.tsx`에 등록합니다.
- API 기본 경로는 same-origin `/api`입니다. 개발·preview 프록시 대상은 `NV_BACKEND`로 지정합니다.
- 브라우저 저장소에는 기존 프로필 설정만 저장합니다. 카드번호·인증 비밀은 저장하지 않습니다.
- 원격 서버에 테스트 주문·결제를 생성하지 않고 목 API로 검증합니다.
- 완료 전 `npm run build`, `npm run lint`, `npm test`를 실행합니다.
