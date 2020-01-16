# UseModel

一个基于React Hooks的状态管理工具。

## Install (Not ready)

```bash
npm install @tarocch1/use-model
```

## Usage

```tsx
import { setModel, useModel } from '@tarocch1/use-model';

class CounterModel {
  count = 0;
  add() {
    this.count++;
  }
  async addAsync() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.count++;
  }
}

setModel(CounterModel);

function Counter() {
  const counter = useModel(CounterModel);
  return (
    <>
      Count: {counter.count}
      <button onClick={counter.add}>+</button>
      <button onClick={counter.addAsync}>+ async</button>
    </>
  );
}
```
