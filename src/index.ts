import { useState, useEffect, Dispatch } from 'react';

export interface Model {
  model: any;
  state: any;
  setters: Dispatch<any>[];
}
export interface Models {
  [name: string]: Model;
}
export interface SetModel {
  (model: any): void;
}
export interface GetModel {
  <T>(model: T): T;
}
export interface UseModel {
  <T>(model: T, noRender?: boolean): T;
}

const models: Models = {};
const names: WeakMap<any, string> = new WeakMap();

export const setModel: SetModel = model => {
  if (typeof model !== 'object') {
    throw new Error('Model must be an object');
  }
  if (names.has(model)) return;
  const name = String(Math.random());
  names.set(model, name);
  const state: any = {};
  for (let key in model) {
    if (typeof model[key] !== 'function') {
      state[key] = model[key];
      Object.defineProperty(model, key, {
        get: function() {
          return models[name].state[key];
        },
        set: function(value) {
          models[name].state[key] = value;
          const { setters } = models[name];
          setters.forEach(setter => setter({ ...models[name].state }));
        },
      });
    }
  }
  models[name] = { model, state, setters: [] };
};

export const getModel: GetModel = model => {
  if (typeof model !== 'object') {
    throw new Error('Model must be an object');
  }
  if (!names.has(model as any)) {
    throw new Error('Model is not set');
  }
  const name = names.get(model as any);
  return models[name!].model;
};

export const useModel: UseModel = (model, noRender = false) => {
  if (typeof model !== 'object') {
    throw new Error('Model must be an object');
  }
  if (!names.has(model as any)) {
    throw new Error('Model is not set');
  }
  const name = names.get(model as any);
  const [, setState] = useState();
  const { setters } = models[name!];
  useEffect(() => {
    if (noRender) return;
    setters.push(setState);
    return () => {
      const index = setters.indexOf(setState);
      setters.splice(index, 1);
    };
  }, []);
  return model;
};
