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

Expo Go 또는 웹에서 열 수 있습니다. 앱의 학교 등록 화면은 현재 `123456`을 개발용 코드로 처리합니다. 서버의 학교 목록은 비어 있고, `GET /api/v1/schools/123456`은 404를 반환합니다.

## 백엔드 연동

- 재고 목록 및 상품: `GET /api/v1/inventory`
- 주문 생성, 목록 및 상세: `/api/v1/orders`
- 개발용 결제: `POST /api/v1/orders/{id}/payments`
- 주문 상태: 상세 조회를 15초마다 갱신하고 수령 확인 시 `delivered`로 변경
- 주문 취소 및 환불: `PATCH /api/v1/orders/{id}/status`, `POST /api/v1/payments/{id}/refund`
- 수령번호: 주문 상세의 `pickup_code` 표시
- 리뷰: 등록, 내 리뷰·매점 리뷰 목록, 사진 조회
- 드론 영상: 스트림·녹화 목록 조회, WHEP 실시간 영상 연결과 녹화 대체 재생

서버에는 학교 조회, 사용자 세션, 알림함, 개발용 카드 API가 추가됐지만 앱에는 아직 연결되지 않았습니다. 휴대폰 인증과 일반 결제수단 저장 엔드포인트는 현재 501 응답으로 정의돼 있습니다. 이름과 연락처, 학교와 장소, 알림 설정은 이 기기에 저장됩니다. 수령 확인 화면은 주문 상태를 직접 `delivered`로 바꾸며, 새로 추가된 사용자 전용 `POST /api/v1/orders/{id}/receipt`는 사용하지 않습니다. 결제는 실제 카드 과금이 아닌 백엔드 개발용 결제입니다.

## 점검

```bash
npx expo lint
npx tsc --noEmit
npx expo export --platform web
```
