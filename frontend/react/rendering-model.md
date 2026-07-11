# 렌더링 모델 (Rendering Model)

컴포넌트는 함수, 렌더링은 그 함수의 재실행. React 원리의 뿌리.
실습: [counter-app](../../projects/counter-app)

## 코드 근거

- `App.tsx`: `const [count, setCount] = useState(0)`, `setCount(count + value)`
- 컴포넌트는 함수다: `function App() { ... }`, `const Viewer = (...) => { ... }`

## 원리 질문 (채우며 정리)

- 컴포넌트 함수는 리렌더될 때마다 어떻게 실행되나? (본문 전체가 처음부터 다시 실행)
- `count`를 그냥 `let count = 0`으로 뒀다면 버튼을 눌러 값을 바꿔도 화면이 바뀔까? state는 왜 필요한가?
- 함수는 매번 재실행되는데 `count`가 5를 "기억"하는 이유는? (상태는 컴포넌트 함수 바깥, React 내부에 저장)
- `setCount`는 값을 **바꾸는** 것인가, 리렌더를 **예약하는** 것인가?
- App이 리렌더되면 자식 Viewer·Controller도 리렌더되나?
- **(적용 상황)** 어떤 값을 state로 둬야 하고, 어떤 값은 그냥 변수로 둬도 되나? (판단 기준: 그 값이 바뀔 때 화면도 바뀌어야 하는가)

## 실험

세 컴포넌트(App/Viewer/Controller) 본문에 `console.log`를 찍고 버튼을 눌러, 누가 몇 번 다시 실행되는지 눈으로 확인해보기.

<!-- 여기에 정리 -->
