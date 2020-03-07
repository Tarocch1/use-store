import { useState, useEffect, Dispatch } from 'react';

interface Model {
  proxy: any;
  setters: Dispatch<any>[];
}
export interface SetModel {
  (Model: new () => any): void;
}
export interface GetModel {
  <T>(Model: new () => T): T;
}
export interface UseModel {
  <T>(Model: new () => T, noRender?: boolean): T;
}

const models: Map<new () => any, Model> = new Map();

export const setModel: SetModel = Model => {
  if (typeof Model !== 'function') {
    throw new Error('Model must be a constructor.');
  }
  if (models.has(Model)) return;
  const proxy = new Proxy(new Model(), {
    get: function(target, prop, receiver) {
      if (typeof target[prop] === 'function') {
        return target[prop].bind(receiver);
      }
      return target[prop];
    },
    set: function(target, prop, value) {
      target[prop] = value;
      const { setters } = models.get(Model)!;
      setters.forEach(setter => {
        setter({ [prop]: value });
      });
      return true;
    },
  });
  models.set(Model, { proxy, setters: [] });
};

export const getModel: GetModel = Model => {
  if (typeof Model !== 'function') {
    throw new Error('Model must be a constructor.');
  }
  if (!models.has(Model)) {
    throw new Error('Model is not set');
  }
  return models.get(Model)!.proxy;
};

export const useModel: UseModel = (Model, noRender = false) => {
  if (typeof Model !== 'function') {
    throw new Error('Model must be a constructor.');
  }
  if (!models.has(Model)) {
    throw new Error('Model is not set');
  }
  const [, setState] = useState();
  const { proxy, setters } = models.get(Model)!;
  useEffect(() => {
    if (noRender) return;
    setters.push(setState);
    return () => {
      const index = setters.indexOf(setState);
      setters.splice(index, 1);
    };
  }, []);
  return proxy;
};
