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

## Android APK 빌드

필요한 도구입니다.

| 도구 | 버전 |
| --- | --- |
| Node.js | 22.13 이상 |
| JDK | 17 |
| Android SDK Platform | 37 (`compileSdk`) |
| Android SDK Build-Tools | 36.0.0 |
| Android NDK | 28.2.13676358 |

SDK 구성 요소는 Android Studio의 SDK Manager나 커맨드라인 도구로 설치합니다. 최신 cmdline-tools에서는 `sdkmanager`가 `android sdk`로 대체됐습니다. SDK 폴더에 쓰기 권한이 있으면 Platform 37은 Gradle이 빌드 중에 자동으로 내려받으므로 따로 설치하지 않아도 됩니다.

`android/` 폴더는 Continuous Native Generation으로 만들어지며 저장소에 포함되지 않습니다. 빌드는 아래 순서로 진행합니다.

```bash
npm install
npx expo prebuild --platform android
cd android
./gradlew :app:assembleRelease
```

결과물은 `android/app/build/outputs/apk/release/app-release.apk`입니다. 에뮬레이터나 기기에는 다음과 같이 설치합니다.

```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

### 빌드 전 확인할 점

- **ABI**: `android/gradle.properties`의 `reactNativeArchitectures`가 포함할 CPU를 정합니다. 에뮬레이터만 쓸 때는 `x86_64`, 실제 기기에 설치하려면 `arm64-v8a`를 포함해야 합니다. 기본값은 네 가지를 모두 넣기 때문에 빌드 시간과 APK 용량이 늘어납니다.
- **서명**: Expo 템플릿의 `release` 빌드 타입은 디버그 키스토어로 서명합니다. 배포용으로 쓰려면 직접 키스토어를 만들고 `android/app/build.gradle`의 `signingConfig`를 바꿔야 합니다.
- **메모리**: 메모리가 부족한 환경에서는 `android/gradle.properties`에 아래 값을 넣어 동시 실행을 줄입니다. `expo prebuild`를 다시 실행하면 이 파일이 덮어써지므로 그때마다 다시 넣어야 합니다.

  ```properties
  org.gradle.jvmargs=-Xmx1024m -XX:MaxMetaspaceSize=384m
  org.gradle.workers.max=1
  org.gradle.parallel=false
  kotlin.daemon.jvmargs=-Xmx512m
  ```

- **읽기 전용 SDK**: SDK 폴더에 쓸 수 없으면 Gradle이 Platform 37을 내려받지 못합니다. 쓰기 가능한 위치에 기존 SDK를 심볼릭 링크로 모은 뒤 `android/local.properties`의 `sdk.dir`을 그 경로로 지정하면 됩니다.

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
