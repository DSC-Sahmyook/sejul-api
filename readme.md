# DSC 삼육 1팀 API 서버

삼육대학교 DSC 프로젝트 1팀의 API 서버 입니다!

## 실행 방법

-   `yarn run start` : 빌드된 항목을 실행합니다. `production` 모드로 실행 됩니다.
-   `yarn run dev` : 개발 서버를 실행합니다. `development` 모드로 실행 됩니다.

## 사용된 기술

-   [x] nodejs
-   [x] express
-   [x] mongodb
-   [x] nodejs
-   [x] typescript

## 개발 요구 사항

루트 폴더에 `development.env`파일과 `production.dev`이 필요합니다. 해당 파일에는 db connection 등의 정보를 포함합니다.
개발에 참여하는 분들은 미리 [이메일](mailto:dev.yoogomja@gmail.com) 혹은 별도로 연락주시면 전달하겠습니다.

## 개발 공통 사항

-   임포트 시 , `./폴더명`으로 항목을 로드할 수 있도록 폴더 아래에 `index.ts`파일을 만들어 활용하도록 합니다.
-   RESTful API의 url룰을 최대한 준수합니다.

## 폴더 구조

### 1. root

폴더의 루트에는 `.env` 파일과, `tsconfig`등이 저장됩니다.

### 2. src

실제 서버 코드들이 담겨지는 폴더 입니다. 해당 폴더에 `index.ts`가 엔트리 파일로 사용됩니다. 실제 `express`의 구동은 `app.ts`에서 확인 할 수 있습니다.
그 외에 `library-ext.d.ts`는 `express`의 유저 타입을 재 정의하기 위해 사용되었습니다.

#### 2.1. src > controllers

`routes`폴더 항목에서 사용되는 컨트롤러들이 모여 있는 폴더 입니다. 주소에 매칭되는 실제 앱 구동 코드들이 보관되어 있습니다.

#### 2.2. src > interfaces

DB 폴더와 연관된 항목입니다. DB의 모델들을 `interface`로 변환해둔 내용들이 저장됩니다.

#### 2.3. src > middlewares

라우터에서 사용할 각종 미들웨어를 모아둡니다. 현재에는 인증관련 미들웨어만 저장되어 있습니다.

#### 2.4. src > routes

주소 매칭 정보가 저장됩니다. `app.ts`에서 불러와 사용하게 됩니다.

### 3. src > utils

앱에서 필요한 각종 유틸리티 함수 혹은 클래스가 모여있습니다.

#### 3.1. src > utils > db

데이터베이스 관련 정보가 저장되어있습니다. DB 커넥터, 연결을 가져오는 함수가 들어있고 `models`폴더에는 `mongodb`에서 사용되는 모델이 저장되어 있습니다.

#### 3.2. src > utils > env

환경 설정 파일을 가져오도록 만들어둔 코드입니다.

#### 3.3. src > utils > passport

인증과 회원가입 등에 필요한 passport 코드가 저장되어 있습니다. `strategies` 폴더에는 `passport`의 `strategy`들이 저장되어 있습니다.

#### 3.4. src > utils > validator

각 API에서 사용할 항목들의 유효성 검사 코드들을 모아둔 폴더 입니다. 중복되는 유효성 검사들을 모아둡니다.
