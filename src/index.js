import React, { useState, useContext } from 'react';

let Context = null;

function Provider({ store = {}, children }) {
  const value = {};
  for (const s in store) {
    const state = store[s].state;
    const action = store[s].action;
    const _action = {};
    for (const a in action) {
      _action[a] = actionFactory(s, action[a]);
    }
    value[s] = {
      state: state,
      action: _action,
    };
  }
  const [_store, _setStore] = useState(value);
  function _getState(name) {
    return _store[name].state;
  }
  function _getAction(name) {
    return _store[name].action;
  }
  function actionFactory(name, action) {
    return function (...args) {
      const newState = action(...args)(_getState, _getAction);
      Promise.resolve(newState).then(function (newState) {
        _setStore(function (value) {
          Object.assign(value[name].state, newState);
          return { ...value };
        });
      });
    };
  }
  Context = React.createContext({});
  return <Context.Provider value={_store}>{children}</Context.Provider>;
}

function useStore(name) {
  const store = useContext(Context);
  return [store[name].state, store[name].action];
}

export { Provider, useStore };
