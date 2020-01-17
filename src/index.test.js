import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { setModel, getModel, useModel } from './index';

configure({ adapter: new Adapter() });

test('Basic Usage', () => {
  class CounterModel {
    count = 0;
    add() {
      this.count++;
    }
  }
  setModel(CounterModel);
  function Counter() {
    const counterModel = useModel(CounterModel);
    return (
      <>
        <div id="count">{counterModel.count}</div>
        <div>
          <button onClick={counterModel.add}>add</button>
        </div>
      </>
    );
  }
  const wrapper = mount(<Counter />);
  expect(wrapper.find('#count').text()).toEqual('0');
  wrapper.find('button').simulate('click');
  expect(wrapper.find('#count').text()).toEqual('1');
});

test('Async Function', done => {
  class CounterModel {
    count = 0;
    async add() {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.count++;
    }
  }
  setModel(CounterModel);
  function Counter() {
    const counterModel = useModel(CounterModel);
    return (
      <>
        <div id="count">{counterModel.count}</div>
        <div>
          <button onClick={counterModel.add}>add</button>
        </div>
      </>
    );
  }
  const wrapper = mount(<Counter />);
  expect(wrapper.find('#count').text()).toEqual('0');
  wrapper.find('button').simulate('click');
  setTimeout(() => {
    expect(wrapper.find('#count').text()).toEqual('1');
    done();
  }, 1000);
});

test('noRender', () => {
  class CounterModel {
    count = 0;
    add() {
      this.count++;
    }
  }
  setModel(CounterModel);
  function Counter() {
    const counterModel = useModel(CounterModel, true);
    return (
      <>
        <div id="count">{counterModel.count}</div>
        <div>
          <button onClick={counterModel.add}>add</button>
        </div>
      </>
    );
  }
  const wrapper = mount(<Counter />);
  expect(wrapper.find('#count').text()).toEqual('0');
  wrapper.find('button').simulate('click');
  expect(wrapper.find('#count').text()).toEqual('0');
});

test('getModel', () => {
  class OtherModel {
    count = 0;
    add() {
      this.count++;
    }
  }
  class CounterModel {
    count = 0;
    add() {
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
        <div id="count">{otherModel.count}</div>
        <div>
          <button onClick={counterModel.add}>add</button>
        </div>
      </>
    );
  }
  const wrapper = mount(<Counter />);
  expect(wrapper.find('#count').text()).toEqual('0');
  wrapper.find('button').simulate('click');
  expect(wrapper.find('#count').text()).toEqual('1');
});
