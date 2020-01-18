import { useState, useEffect, Dispatch } from 'react';

export interface Model {
  instance: any;
  state: any;
  setters: Dispatch<any>[];
}
export interface Models {
  [name: string]: Model;
}
export interface SetModel {
  (model: new () => any): void;
}
export interface GetModel {
  <T>(model: new () => T): T;
}
export interface UseModel {
  <T>(model: new () => T, noRender?: boolean): T;
}

const models: Models = {};

export const setModel: SetModel = model => {
  if (typeof model !== 'function') {
    throw new Error('Model must be a constructor');
  }
  if (model.name in models) return;
  const instance = new model();
  const state: any = {};
  for (let key in instance) {
    if (typeof instance[key] !== 'function') {
      state[key] = instance[key];
      Object.defineProperty(instance, key, {
        get: function() {
          return models[model.name].state[key];
        },
        set: function(value) {
          models[model.name].state[key] = value;
          const { setters } = models[model.name];
          setters.forEach(setter => setter({ ...models[model.name].state }));
        },
      });
    }
  }
  models[model.name] = { instance, state, setters: [] };
};

export const getModel: GetModel = model => {
  if (typeof model !== 'function') {
    throw new Error('Model must be a constructor');
  }
  if (!(model.name in models)) {
    throw new Error('Model is not set');
  }
  return models[model.name].instance;
};

export const useModel: UseModel = (model, noRender = false) => {
  if (typeof model !== 'function') {
    throw new Error('Model must be a constructor');
  }
  if (!(model.name in models)) {
    throw new Error('Model is not set');
  }
  const [, setState] = useState();
  const { instance, setters } = models[model.name];
  useEffect(() => {
    if (noRender) return;
    setters.push(setState);
    return () => {
      const index = setters.indexOf(setState);
      setters.splice(index, 1);
    };
  }, []);
  return instance;
};
