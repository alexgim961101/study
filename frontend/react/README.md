# React

React 핵심 개념 정리. 각 노트는 독립적으로 읽을 수 있다.
실습 프로젝트: [counter-app](../../projects/counter-app)

## 노트

- [선언형 UI](./declarative-ui.md) — 상태만 선언하면 화면은 React가 맞춘다. 명령형 DOM 조작과의 차이.
- [렌더링 모델](./rendering-model.md) — 컴포넌트=함수, 렌더링=재실행. state는 왜 함수 바깥에 저장되는가.
- [단방향 데이터 흐름](./data-flow.md) — 데이터↓(props)·이벤트↑(콜백), 단일 출처, state lifting.
- [State 스냅샷](./state-as-snapshot.md) — state는 이번 렌더의 스냅샷. 함수형 업데이트가 필요한 이유.

<!-- React 노트가 늘면 여기에 한 줄씩 추가 (예: useEffect, context) -->
