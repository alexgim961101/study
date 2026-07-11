# State 스냅샷 (State as a Snapshot)

state는 "지금 이 렌더링 시점의 값". 가장 깊고 헷갈리는 주제 — 카운터가 최적의 실험대.
실습: [counter-app](../../projects/counter-app)

## 코드 근거

- `App.tsx`: `const onClickButton = (value) => { setCount(count + value) }`
- 여기서 `count`는 "이 핸들러가 만들어진 렌더링 시점"의 값이다.

## 원리 질문 (채우며 정리)

- `onClickButton` 안의 `count`는 **어느 시점**의 값인가?
- 한 핸들러 안에서 `setCount(count + 1)`을 두 번 부르면 2가 오를까 1이 오를까? 왜?
- `setCount(c => c + 1)`(함수형 업데이트)은 위와 무엇이 다른가? 언제 반드시 필요한가?
- "스냅샷"이라는 비유가 정확히 뜻하는 바는?
- **(적용 상황)** 함수형 업데이트(`c => c + 1`)를 반드시 써야 하는 실제 상황은? (예: 한 이벤트에서 여러 번 갱신, 이전 값에 기반한 갱신)

## 실험

`setCount(count + 1)`을 한 핸들러에서 연속 두 번 호출 → 결과 관찰 → `setCount(c => c + 1)`로 바꿔 다시 관찰하고 차이 비교.

<!-- 여기에 정리 -->
