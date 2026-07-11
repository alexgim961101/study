# counter-app

React 학습용 간단한 카운터 앱. 버튼으로 숫자를 ±1 / ±10 / ±100 만큼 증감시킨다.
React의 핵심 사이클(state 변경 → 리렌더링 → 화면 반영)과 컴포넌트 분리·props 전달을 연습하기 위한 예제.

## 기술 스택

- React 19
- TypeScript
- Vite

## 실행 방법

```bash
npm install      # 의존성 설치 (최초 1회)
npm run dev      # 개발 서버 실행 (http://localhost:5173)
npm run build    # 타입 체크(tsc) + 배포용 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint     # ESLint 검사
```

## 구조

상태(state)는 최상위 `App`이 소유하고, 표시와 조작을 각각 별도 컴포넌트로 분리했다.

```
src/
├── main.tsx              # 진입점: #root에 <App /> 렌더링
├── App.tsx               # count state 소유, 증감 로직 정의
└── components/
    ├── Viewer.tsx        # 현재 count 값을 표시 (props로 count 받음)
    └── Controller.tsx    # ±1/±10/±100 버튼, 클릭 시 부모 콜백 호출
```

- **App** — `useState`로 `count`를 관리하고, `onClickButton(value)`로 증감 값을 받아 state를 갱신한다.
- **Viewer** — `count`를 props로 받아 화면에 출력하는 표시 전용 컴포넌트.
- **Controller** — 버튼 클릭 시 부모가 내려준 `onClickButton` 콜백에 증감 값을 전달한다. 상태를 직접 갖지 않는다.

데이터는 위(App)에서 아래(Viewer/Controller)로 props를 통해 흐르고, 이벤트는 콜백을 통해 아래에서 위로 전달된다.
