import { useState, useEffect, Dispatch } from 'react';

export interface Model {
  proxy: any;
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
  const proxy = new Proxy(new model(), {
    get: function(target, prop, receiver) {
      if (typeof target[prop] === 'function') {
        return target[prop].bind(receiver);
      }
      return target[prop];
    },
    set: function(target, prop, value) {
      target[prop] = value;
      const { setters } = models[model.name];
      setters.forEach(setter => {
        setter({ [prop]: value });
      });
      return true;
    },
  });
  models[model.name] = { proxy, setters: [] };
};

export const getModel: GetModel = model => {
  return models[model.name].proxy;
};

export const useModel: UseModel = (model, noRender = false) => {
  const [, setState] = useState();
  const { proxy, setters } = models[model.name];
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
