import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { setModel, getModel, useModel } from './index';

configure({ adapter: new Adapter() });

test('Basic Usage', () => {
  class CounterModel1 {
    count = 0;
    add = () => {
      this.count++;
    };
  }
  const counterModel1 = new CounterModel1();
  setModel(counterModel1);
  function Counter() {
    const _counterModel = useModel(counterModel1);
    return (
      <>
        <div id="count">{_counterModel.count}</div>
        <div>
          <button onClick={_counterModel.add}>add</button>
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
  class CounterModel2 {
    count = 0;
    add = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.count++;
    };
  }
  const counterModel2 = new CounterModel2();
  setModel(counterModel2);
  function Counter() {
    const _counterModel = useModel(counterModel2);
    return (
      <>
        <div id="count">{_counterModel.count}</div>
        <div>
          <button onClick={_counterModel.add}>add</button>
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
  class CounterModel3 {
    count = 0;
    add = () => {
      this.count++;
    };
  }
  const counterModel3 = new CounterModel3();
  setModel(counterModel3);
  function Counter() {
    const _counterModel = useModel(counterModel3, true);
    return (
      <>
        <div id="count">{_counterModel.count}</div>
        <div>
          <button onClick={_counterModel.add}>add</button>
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
    add = () => {
      this.count++;
    };
  }
  const otherModel = new OtherModel();
  class CounterModel4 {
    count = 0;
    add = () => {
      const _otherModel = getModel(otherModel);
      _otherModel.add();
    };
  }
  const counterModel4 = new CounterModel4();
  setModel(otherModel);
  setModel(counterModel4);
  function Counter() {
    const _otherModel = useModel(otherModel);
    const _counterModel = useModel(counterModel4);
    return (
      <>
        <div id="count">{_otherModel.count}</div>
        <div>
          <button onClick={_counterModel.add}>add</button>
        </div>
      </>
    );
  }
  const wrapper = mount(<Counter />);
  expect(wrapper.find('#count').text()).toEqual('0');
  wrapper.find('button').simulate('click');
  expect(wrapper.find('#count').text()).toEqual('1');
});

test('Error', () => {
  expect(() => {
    setModel('Not a model');
  }).toThrow();

  expect(() => {
    useModel('Not a model');
  }).toThrow();

  class CounterModel5 {
    count = 0;
    add = () => {
      this.count++;
    };
  }

  const counterModel5 = new CounterModel5();

  expect(() => {
    useModel(counterModel5);
  }).toThrow();
});
