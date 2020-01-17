# UseModel

一个基于React Hooks的状态管理工具。

[![npm](https://img.shields.io/npm/v/@tarocch1/use-model)](https://www.npmjs.com/package/@tarocch1/use-model)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@tarocch1/use-model)](https://bundlephobia.com/result?p=@tarocch1/use-model)
[![GitHub](https://img.shields.io/github/license/tarocch1/use-model)](https://github.com/Tarocch1/use-model/blob/master/LICENSE)

## Install

```bash
npm install @tarocch1/use-model
```

## Usage

```tsx
import { setModel, useModel } from '@tarocch1/use-model';

class CounterModel {
  count = 0;
  add = () => {
    this.count++;
  }
  addAsync = async () => {
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

## Api

### setModel(Model)

初始化一个模型，接受一个构造函数作为参数。所有模型都应且仅应初始化一次，才可以使用。

### getModel(Model)

用于在模型中获取其他模型, 接受一个构造函数作为参数。该函数只应在模型中使用，在组件中时应用 `useModel` 。

```tsx
import { setModel, getModel, useModel } from '@tarocch1/use-model';

class OtherModel {
  count = 0;
  add = () => {
    this.count++;
  }
}
class CounterModel {
  count = 0;
  add = () => {
    const otherModel = getModel(OtherModel);
    otherModel.add();
  }
}

setModel(CounterModel);
setModel(OtherModel);

function Counter() {
  const counterModel = useModel(CounterModel);
  const otherModel = useModel(OtherModel);
  return (
    <>
      Count: {otherModel.count}
      <button onClick={counterModel.add}>+</button>
    </>
  );
}
```

### useModel(Model, noRender = false)

获取模型的Hook，在组件中使用，返回模型初始化后的实例。接收两个参数：第一个参数为模型构造函数；第二个参数指定是否接收数据变化并重新渲染，当设置为 `true` 时，组件不会重新渲染，默认为 `false` ，当某个组件仅需要访问模型方法而不需要绑定模型数据时，可以使用该选项优化性能。

## Credit

本项目借鉴了[https://github.com/nanxiaobei/flooks](https://github.com/nanxiaobei/flooks)的部分设计思路，修改了api格式以及一些底层实现方式以提高使用便捷度和更好地支持TypeScript。
