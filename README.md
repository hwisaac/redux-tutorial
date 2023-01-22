# Redux-tutorial

Learning Redux

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

- state 는 single source fo truth 고 read-only 이다. (오로지 action 을 보내는 것으로만 state를 수정한다.)
- state를 mutate 하지 않는다. 새로운 state를 리턴해야 한다.
