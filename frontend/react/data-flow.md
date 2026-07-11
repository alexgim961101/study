# 단방향 데이터 흐름 (One-way Data Flow)

App/Viewer/Controller로 나눈 구조의 설계 원리.
실습: [counter-app](../../projects/counter-app)

## 코드 근거

- `<Viewer count={count}/>` — 데이터는 부모(App) → 자식(Viewer)로 props를 통해 내려감.
- `<Controller onClickButton={onClickButton}/>` — 자식의 이벤트는 콜백을 통해 부모로 올라옴.
- `count` state는 오직 `App`만 소유한다.

## 정리

### 1. 데이터는 부모 → 자식으로만 흐른다

React에서 데이터는 **오직 부모 → 자식(props)** 방향으로만 흐른다. **형제(sibling)끼리 직접 주고받는 통로는 없다.**

그래서 `Viewer`(count 표시)와 `Controller`(count 변경)가 같은 `count`를 공유하려면, 둘의 **가장 가까운 공통 부모(App)로 state를 끌어올려야** 한다 = **상태 끌어올리기(lifting state up)**. 그 결과 App이 count의 **단일 출처(single source of truth)**가 된다.

### 2. 데이터 ↓, 이벤트 ↑

- **데이터 ↓** (props): App → `Viewer`(`count`), App → `Controller`(`onClickButton`)
- **이벤트 ↑** (콜백): `Controller`가 `onClickButton(-1)` 호출 = App에게 "바꿔줘" **요청**

`Controller`는 `count`도 `setCount`도 모른다. App이 정의한(그 안에 `setCount`가 든) 함수를 **받아서 호출**할 뿐이다. **실제 state 변경은 항상 소유자 App이** 한다.

> 자식은 받은 props를 직접 못 바꾼다(read-only). 바꾸고 싶으면 콜백으로 소유자에게 요청한다.

### 3. 왜 이렇게? (이점)

state가 **한 곳(App)에서만** 바뀌니, 값이 이상하면 **그 한 곳만 보면 된다.** 아무나 직접 바꿀 수 있으면 값이 틀렸을 때 용의자가 N명이지만, 단방향은 **용의자를 1명(소유자)으로** 좁힌다 → 예측 가능성·디버깅 용이.

### 4. (적용) 새 state를 어디에 둘까

> **그 state를 쓰는 컴포넌트들의 "가장 가까운 공통 부모"에 둔다.**

- 여러 컴포넌트가 공유 → 공통 부모로 **올린다**(lifting). 예: `clickCount`(Viewer 표시 + Controller 증가) → App
- 한 컴포넌트만 씀 → **그 컴포넌트 안에** 둔다. 예: `isHovered`(Controller만 사용) → Controller
- **필요한 만큼만 올리고 그 이상 올리지 마라.** 무조건 App에 몰면, 한 컴포넌트만 쓰는 상태가 바뀔 때도 App이 리렌더 → 부모 리렌더 = 자식 전부 리렌더(불필요한 낭비). (→ [rendering-model](./rendering-model.md))

## 한 줄 요약

데이터는 부모→자식(props)으로만 흐르고, 변경은 콜백으로 소유자에게 요청한다(데이터↓/이벤트↑). state는 그걸 쓰는 컴포넌트들의 가장 가까운 공통 부모에 두어 변경 지점을 한 곳으로 모은다.
