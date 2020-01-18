import { useState, useEffect, Dispatch } from 'react';

interface Model {
  model: any;
  state: any;
  setters: Dispatch<any>[];
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

const models: WeakMap<any, Model> = new WeakMap();

export const setModel: SetModel = model => {
  if (typeof model !== 'object') {
    throw new Error('Model must be an object');
  }
  if (models.has(model)) return;
  const state: any = {};
  for (let key in model) {
    if (typeof model[key] !== 'function') {
      state[key] = model[key];
      Object.defineProperty(model, key, {
        get: function() {
          return models.get(model)!.state[key];
        },
        set: function(value) {
          const { state, setters } = models.get(model)!;
          state[key] = value;
          setters.forEach(setter => setter({ ...state }));
        },
      });
    }
  }
  models.set(model, { model, state, setters: [] });
};

export const getModel: GetModel = model => {
  if (typeof model !== 'object') {
    throw new Error('Model must be an object');
  }
  if (!models.has(model)) {
    throw new Error('Model is not set');
  }
  return models.get(model)!.model;
};

export const useModel: UseModel = (model, noRender = false) => {
  if (typeof model !== 'object') {
    throw new Error('Model must be an object');
  }
  if (!models.has(model)) {
    throw new Error('Model is not set');
  }
  const [, setState] = useState();
  const { setters } = models.get(model)!;
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
