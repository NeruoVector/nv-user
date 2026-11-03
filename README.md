# 교내 배달 사용자 앱

Expo SDK 58 기반 iOS, Android, 웹 앱입니다. [Figma 사용자 앱 시안](https://www.figma.com/design/5cG3AE9mvVh4PadWxF4P54/?node-id=132-2)의 가입, 매점 탐색, 주문, 배송, 마이 화면을 구현했습니다.

## 실행

Node.js 22.13 이상이 필요합니다.

```bash
npm install
npm start
```

앱은 기본적으로 `https://neurovector-backend.forge-lang.org`에 연결됩니다. 다른 서버를 쓰려면 `.env`에 다음 값을 설정하세요.

```env
EXPO_PUBLIC_BACKEND_BASE_URL=https://neurovector-backend.forge-lang.org
```

Expo Go 또는 웹에서 열 수 있습니다. 학교 연결에 쓰는 개발용 코드는 `123456`입니다.

## 백엔드 연동

- 재고 목록 및 상품: `GET /api/v1/inventory`
- 주문 생성, 목록 및 상세: `/api/v1/orders`
- 개발용 결제: `POST /api/v1/orders/{id}/payments`
- 주문 상태: 상세 조회를 15초마다 갱신

백엔드에 없는 휴대폰 인증, 학교 코드 조회, 사용자 세션, 알림 발송, 리뷰, 결제수단 저장 API는 연결할 수 없습니다. 이름과 연락처, 학교와 장소, 알림 설정, 최근 리뷰는 이 기기에 저장됩니다. 수령 확인도 이 기기에서만 표시되며 서버 주문 상태는 배송 담당자가 변경합니다. 결제는 실제 카드 과금이 아닌 백엔드 개발용 결제입니다.

## 점검

```bash
npx expo lint
npx tsc --noEmit
npx expo export --platform web
```
