import React, { useState, useContext, useMemo } from 'react';

const Context = React.createContext({});

function Provider({ store = {}, children }) {
  const initStore = useMemo(
    function () {
      const value = {};
      for (const s in store) {
        const _action = {};
        for (const a in store[s].action) {
          _action[a] = actionFactory(s, store[s].action[a]);
        }
        value[s] = {
          state: store[s].state,
          action: _action,
        };
      }
      return value;
    },
    [store],
  );
  const [_store, _setStore] = useState(initStore);
  function _getState(storeName) {
    return _store[storeName].state;
  }
  function _getAction(storeName) {
    return _store[storeName].action;
  }
  function _setState(storeName, newState) {
    _setStore(function (value) {
      Object.assign(value[storeName].state, newState);
      return { ...value };
    });
  }
  function actionFactory(storeName, action) {
    function setState(newState) {
      _setState(storeName, newState);
    }
    return function (...args) {
      return action(...args)({
        getState: _getState,
        getAction: _getAction,
        setState,
      });
    };
  }
  return <Context.Provider value={_store}>{children}</Context.Provider>;
}

function useStore(storeName) {
  const store = useContext(Context);
  return [store[storeName].state, store[storeName].action];
}

function defineStore(store) {
  return store;
}

export { Provider, useStore, defineStore };
