# 단방향 데이터 흐름 (One-way Data Flow)

App/Viewer/Controller로 나눈 구조의 설계 원리.
실습: [counter-app](../../projects/counter-app)

## 코드 근거

- `<Viewer count={count}/>` — 데이터는 부모(App) → 자식(Viewer)로 props를 통해 내려감.
- `<Controller onClickButton={onClickButton}/>` — 자식의 이벤트는 콜백을 통해 부모로 올라옴.
- `count` state는 오직 `App`만 소유한다.

## 원리 질문 (채우며 정리)

- 왜 `count`는 App만 소유하나? (단일 출처 / single source of truth)
- 데이터는 어느 방향으로 흐르나? 이벤트는 어느 방향으로 전달되나?
- Viewer와 Controller가 같은 `count`를 공유하려면 왜 상태를 공통 부모(App)로 올려야 하나? (state lifting)
- props로 받은 값을 자식이 직접 바꿀 수 있나? 없다면 그 이유는?
- 단방향 흐름이 예측 가능성·디버깅에 주는 이점은?
- **(적용 상황)** 새 state를 만들 때 어느 컴포넌트에 둘지 어떻게 정하나? (그 값을 함께 쓰는 컴포넌트들의 가장 가까운 공통 부모)

<!-- 여기에 정리 -->
