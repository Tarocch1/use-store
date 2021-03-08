# Usestore

一个基于 React Hooks 的状态管理工具。

[![npm](https://img.shields.io/npm/v/@tarocch1/use-store)](https://www.npmjs.com/package/@tarocch1/use-store)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@tarocch1/use-store)](https://bundlephobia.com/result?p=@tarocch1/use-store)
[![GitHub](https://img.shields.io/github/license/tarocch1/use-store)](https://github.com/Tarocch1/use-store/blob/master/LICENSE)
![Test Workflow](https://github.com/Tarocch1/use-store/workflows/Test%20Workflow/badge.svg)

## Install

```bash
npm install @tarocch1/use-store
```

## Usage

```jsx
import { Provider, useStore } from '@tarocch1/use-store';

const countStore = {
  state: {
    count: 0,
  },
  action: {
    plus: () => getState => {
      const { count } = getState('countStore');
      return { count: count + 1 };
    },
    plusAsync: () => async getState => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const { count } = getState('countStore');
      return { count: count + 1 };
    },
    plusSomething: num => getState => {
      const { count } = getState('countStore');
      return { count: count + num };
    },
  },
};

function Counter() {
  const [countState, countAction] = useStore('countStore');
  return (
    <>
      <p>Count: {countState.count}</p>
      <button onClick={countAction.plus}>+</button>
      <button onClick={countAction.addAsync}>+ async</button>
      <button onClick={() => countAction.plusSomething(2)}>+2</button>
    </>
  );
}

ReactDOM.render(
  <Provider store={{ countStore }}>
    <Counter />
  </Provider>,
  container,
);
```
