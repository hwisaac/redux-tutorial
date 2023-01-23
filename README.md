# Redux-tutorial

Learning Redux<br>
<img src="https://img.shields.io/badge/redux-764ABC?style=flat&logo=redux&logoColor=white"/>
<img src="https://img.shields.io/badge/react-61DAFB?style=flat&logo=react&logoColor=black"/>

## vanilla redux

```jsx
// src/index.js
const add = document.getElementById("add");
const minus = document.getElementById("minus");
const number = document.querySelector("span");

let count = 0;
number.innerText = count;

const updateText = () => {
  number.innerText = count;
};

const handleAdd = () => {
  count = count + 1;
  updateText();
};

const handleMinus = () => {
  count = count - 1;
  updateText();
};

add.addEventListener("click", handleAdd);
minus.addEventListener("click", handleMinus);
```

```html
<body>
  <button id="add">Add</button>
  <span></span>
  <button id="minus">Minus</button>
</body>
```

![](readMeImages/2023-01-22-22-40-34.png)

> 이 코드를 리덕스로 바꿔보자

### 사용하기

> npm add redux

1. reducer 를 만든다. 데이터를 modify 하는 함수이다.
   1. reducer 에 첫번째 인자는 state
   2. reducer 의 두번째 인자는 action: reducer와 소통하기 위한 함수

> action 사용하는 방법.

- `store.dispatch()` 메소드를 사용한다. 인자는 `type` 속성을 포함한 객체로 전달한다. (객체에 다른 정보를 넣어 reducer 안에 전달할 수 있다.)
- `dispatch`는 해당 객체를 `reducer`의 `action` 으로 전달하고 `reducer`는 `action` 에 해당하는 `modify`를 한다.

1. `store`를 만든다 :
2. `createStore` 함수에 `reducer` 함수(countModifer)를 넣어준다
3. `store.subscribe()` 메소드를 사용해 데이터를 추적한다.
   - 인자로 함수를 넘긴다. 데이터가 변하면 해당 함수를 실행한다.(보통 업데이트하는 함수를 전달)

> `store` 란? <br>
> 데이터를 저장하는 장소이다 ex)state<br> > `reducer` 란? <br>
> 데이터를 modify 하는 함수이다. <br>
> reducer가 리턴하는 값이 새로운 데이터값이 된다.
> reducer 는 현재의 state와 함께 불려진다

```jsx
// redux 적용
import { createStore } from "redux";

const add = document.getElementById("add");
const minus = document.getElementById("minus");
const number = document.querySelector("span");

number.innerText = 0;

const ADD = "ADD";
const MINUS = "MINUS";

const countModifier = (count = 0, action) => {
  switch (action.type) {
    case ADD:
      return count + 1;
    case MINUS:
      return count - 1;
    default:
      return count;
  }
};

const countStore = createStore(countModifier);

const onChange = () => {
  number.innerText = countStore.getState();
};

countStore.subscribe(onChange);

const handleAdd = () => {
  countStore.dispatch({ type: ADD });
};

const handleMinus = () => {
  countStore.dispatch({ type: MINUS });
};

add.addEventListener("click", handleAdd);
minus.addEventListener("click", handleMinus);
```

### 예제2: TODO_LIST

```html
<h1>To Dos</h1>
<form>
  <input type="text" placeholder="Write to do" />
  <button>Add</button>
</form>
<ul></ul>
```

```jsx
import { createStore } from "redux";
const form = document.querySelector("form");
const input = document.querySelector("input");
const ul = document.querySelector("ul");

const ADD_TODO = "ADD_TODO";
const DELETE_TODO = "DELETE_TODO";

const reducer = (state = [], action) => {
  console.log(action);
  switch (action.type) {
    case ADD_TODO:
      return [];
    case DELETE_TODO:
      return [];
    default:
      return state;
  }
};

const store = createStore(reducer);

const onSubmit = (e) => {
  e.preventDefault();
  const toDo = input.value;
  input.value = "";
  store.dispatch({ type: ADD_TODO, text: toDo });
};

form.addEventListener("submit", onSubmit);
```

## 리덕스의 3 원리

1. Single source of truth

   - 전역 state는 **하나의** store 의 오브젝트 트리에 저장한다.
   - 이 원리를 지켜야 유지보수가 쉽고 개발 사이클에 유익하다.

2. state 는 read-only 이다.

   - 오로지 action 을 보내는 것으로만 state를 수정한다.

3. reducer 는 순수함수로 작성한다.
   - state를 mutate 하지 않는다. 새로운 state를 리턴해야 한다.

## react-redux

- redux 와 react-redux 둘다 설치해야 한다.
- 설치 : npm i react-redux redux

> react-redux 는 store를 구독하고, 변경사항에 대해 리랜더링 하게 해준다.

### 절차 (투두리스트)

1. store 를 만든다.

```js
// store.js
import { createStore } from "redux";

const ADD = "ADD";
const DELETE = "DELETE";

export const addToDo = (text) => {
  return {
    type: ADD,
    text,
  };
};

export const deleteToDo = (id) => {
  return {
    type: DELETE,
    id,
  };
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case ADD:
      return [{ text: action.text, id: Date.now() }, ...state];
    case DELETE:
      return state.filter((toDo) => toDo !== action.id);
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
```

2. 프로바이더로 store 를 제공한다.

```js
// index.js
root.render(
  <Provider store={store}>
    <App />
)
</Provider>
```

3. connect 로 연결해준다.

- connect 는 `컴포넌트`를 `store` 에 연결시켜준다.
- connect 는 '함수 -> 함수'인 함수이다.
- connect(f)(component) 는 컴포넌트이다.
- store 에 있는 state 를 업데이트 하고 싶기도하고 가져오고 싶기도 할 때가 있다 -> `connect(getCurrentState)(Component)`

#### `function mapStateToProps(state, ownProps?)`

- connect 함수의 **첫번째 인자**
- `state` : store 에서 오는 `state`
- `ownProps`: 컴포넌트에서 오는 `props` `{toDos}`
- `mapStateToProps` 함수의 리턴값은 `Home` 컴포넌트의 `prop` 에 추가된다.(connect 함수가 한 일 )

#### `function mapDispatchToProps(dispatch, ownProps?)`

- connect 함수의 **두번째 인자**
- store.dispatch() 와 같은역할
- 객체를 리턴해야 한다. 객체는 dispatcher 함수들을 담고있다.
- 리턴 값은 (Home)컴포넌트의 props 로 전달된다.
- `ownProps`는 컴포넌트가 받아내는 props 가 들어온다
  > Home.js

```jsx
// routes/Home.js
function Home({toDos}){
  // logic
  return (...)
}

function mapStateToProps(state) {// state 를 받아 props로 리턴하는 함수. store.getState() 역할
  return { toDos: state };
}

function mapDispatchToProps(dispatch) {
  return {
    addToDo: (text) => dispatch(actionCreators.addToDo(text)),
  };
}

// store에 있는 state를 Home으로 가져와 연결시킨다.
export default connect(mapStateToProps, mapDispatchToProps)(Home);
```

> store.js

```jsx
// store.js
import { createStore } from "redux";

const ADD = "ADD";
const DELETE = "DELETE";

const addToDo = (text) => {
  return {
    type: ADD,
    text,
  };
};

const deleteToDo = (id) => {
  return {
    type: DELETE,
    id: parseInt(id),
  };
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case ADD:
      return [{ text: action.text, id: Date.now() }, ...state];
    case DELETE:
      return state.filter((toDo) => toDo.id !== action.id);
    default:
      return state;
  }
};

const store = createStore(reducer);

export const actionCreators = {
  addToDo,
  deleteToDo,
};

export default store;
```

> ToDo.js

```js
// ToDo.js
import React from "react";
import { connect } from "react-redux";
import { actionCreators } from "../store";
import { Link } from "react-router-dom";

function ToDo({ text, onBtnClick, id }) {
  return (
    <li>
      <Link to={`/${id}`}>
        {text} <button onClick={onBtnClick}>DEL</button>
      </Link>
    </li>
  );
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onBtnClick: () => dispatch(actionCreators.deleteToDo(ownProps.id)),
  };
}

export default connect(null, mapDispatchToProps)(ToDo);
```

> Detail.js

```js
// Detail.js
import React from "react";
import { connect } from "react-redux";

function Detail({ toDo }) {
  return (
    <>
      <h1>{toDo?.text}</h1>
      <h5>Created at: {toDo?.id}</h5>
    </>
  );
}

function mapStateToProps(state, ownProps) {
  const {
    match: {
      params: { id },
    },
  } = ownProps;
  return { toDo: state.find((toDo) => toDo.id === parseInt(id)) };
}

export default connect(mapStateToProps)(Detail);
```

## Redux Toolkit

- 위와같이 Boilerplate code 를 써야 하는 것에 대해서 사람들이 불평한다.
- 리덕스 툴킷은 shortcut을 모아놓은 패키지다

### 설치

- `npm install @reduxjs/toolkit` 이미 앱이 있을 경우
- `npx create-react-app my-app --template redux-typescript` 프로젝트를 시작할경우

### createAction

### createReducer

- 기존 리덕스에서는 데이터를 mutate 하는게 금기였지만 툴킷에서는 배열에 push 같은 걸 해도 괜찮다(안보이는 영역에서 원본을 복사해서 처리하므로 원본을 지키는 작업이 있기 때문)

### configureStore

### createSlice
