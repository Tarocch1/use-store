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
  setModel(CounterModel1);
  function Counter() {
    const counterModel = useModel(CounterModel1);
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
  class CounterModel2 {
    count = 0;
    add = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.count++;
    };
  }
  setModel(CounterModel2);
  function Counter() {
    const counterModel = useModel(CounterModel2);
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
  class CounterModel3 {
    count = 0;
    add = () => {
      this.count++;
    };
  }
  setModel(CounterModel3);
  function Counter() {
    const counterModel = useModel(CounterModel3, true);
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
    add = () => {
      this.count++;
    };
  }
  class CounterModel4 {
    count = 0;
    add = () => {
      const otherModel = getModel(OtherModel);
      otherModel.add();
    };
  }
  setModel(CounterModel4);
  setModel(OtherModel);
  function Counter() {
    const counterModel = useModel(CounterModel4);
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

  expect(() => {
    useModel(CounterModel5);
  }).toThrow();
});
