# 선언형 UI (Declarative UI)

React가 **왜 존재하는가**에 대한 답. 실습: [counter-app](../../projects/counter-app)

## 코드 근거

- `Viewer.tsx`: `<p>{ count }</p>` — 화면에 DOM 조작 코드가 한 줄도 없다.
- 바닐라 JS라면 카운트를 바꿀 때: `element.textContent = count` 처럼 DOM을 직접 지시해야 한다.

## 원리 질문 (채우며 정리)

- 명령형(imperative)과 선언형(declarative)의 차이는? 바닐라 카운터와 대비해보기.
- 내 코드엔 DOM을 직접 건드리는 부분이 없는데, 그럼 화면은 **누가** 바꾸나?
- 선언형("이 상태면 화면은 이렇게 생겼다"만 선언)이 주는 이점은?
- 상태가 바뀌면 React는 화면을 통째로 다시 그리나, 아니면 바뀐 부분만? (Virtual DOM / reconciliation 맛보기)
- **(적용 상황)** 선언형으로 안 되고 명령형으로 DOM을 직접 만져야 하는 예외는 언제인가? (예: 포커스 이동, 스크롤, 외부 라이브러리 연동)

<!-- 여기에 정리 -->
