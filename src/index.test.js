import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider, useStore } from './index';

test('Basic usage', async () => {
  const countStore = {
    state: {
      count: 0,
    },
    action: {
      plus: () => ({ getState, setState }) => {
        const { count } = getState('countStore');
        setState({ count: count + 1 });
      },
      plusSomething: num => ({ getState, setState }) => {
        const { count } = getState('countStore');
        setState({ count: count + num });
      },
    },
  };
  function App() {
    const [countState, countAction] = useStore('countStore');
    return (
      <>
        <div data-testid="count">{countState.count}</div>
        <div>
          <button onClick={countAction.plus} data-testid="plus">
            plus
          </button>
          <button
            onClick={() => countAction.plusSomething(2)}
            data-testid="plusSomething"
          >
            plusSomething
          </button>
        </div>
      </>
    );
  }
  render(
    <Provider store={{ countStore }}>
      <App />
    </Provider>,
  );
  expect(screen.getByTestId('count')).toHaveTextContent('0');
  fireEvent.click(screen.getByTestId('plus'));
  await waitFor(() =>
    expect(screen.getByTestId('count')).toHaveTextContent('1'),
  );
  fireEvent.click(screen.getByTestId('plusSomething'));
  await waitFor(() =>
    expect(screen.getByTestId('count')).toHaveTextContent('3'),
  );
});

test('Async action', async () => {
  const countStore = {
    state: {
      count: 0,
    },
    action: {
      plus: () => async ({ getState, setState }) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const { count } = getState('countStore');
        setState({ count: count + 1 });
      },
    },
  };
  function App() {
    const [countState, countAction] = useStore('countStore');
    return (
      <>
        <div data-testid="count">{countState.count}</div>
        <div>
          <button onClick={countAction.plus} data-testid="plus">
            plus
          </button>
        </div>
      </>
    );
  }
  render(
    <Provider store={{ countStore }}>
      <App />
    </Provider>,
  );
  expect(screen.getByTestId('count')).toHaveTextContent('0');
  fireEvent.click(screen.getByTestId('plus'));
  await waitFor(() =>
    expect(screen.getByTestId('count')).toHaveTextContent('1'),
  );
});

test('getAction', async () => {
  const countStore = {
    state: {
      count: 0,
    },
    action: {
      plus: () => ({ getState, setState }) => {
        const { count } = getState('countStore');
        setState({ count: count + 1 });
      },
    },
  };
  const otherStore = {
    state: {
      count: 0,
    },
    action: {
      plus: () => ({ getAction }) => {
        const { plus } = getAction('countStore');
        plus();
      },
    },
  };
  function App() {
    const [countState] = useStore('countStore');
    const [otherState, otherAction] = useStore('otherStore');
    return (
      <>
        <div data-testid="count">{countState.count}</div>
        <div data-testid="other">{otherState.count}</div>
        <div>
          <button onClick={otherAction.plus} data-testid="plus">
            plus
          </button>
        </div>
      </>
    );
  }
  render(
    <Provider store={{ countStore, otherStore }}>
      <App />
    </Provider>,
  );
  expect(screen.getByTestId('count')).toHaveTextContent('0');
  expect(screen.getByTestId('other')).toHaveTextContent('0');
  fireEvent.click(screen.getByTestId('plus'));
  await waitFor(() => {
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('other')).toHaveTextContent('0');
  });
});
