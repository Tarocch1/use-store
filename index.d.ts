import * as React from 'react';

export type State = {
  [key: string]: any;
};

export type Action = {
  [key: string]: ActionFunc;
};

export type GetState = <T extends Store>(
  storeName: string,
) => InternalState<T['state']>;
export type GetAction = <T extends Store>(
  storeName: string,
) => InternalAction<T['action']>;
export type SetState = <T extends Store>(
  newState: Partial<InternalState<T['state']>>,
) => void;

export type ActionFuncMidArg = {
  getState?: GetState;
  getAction?: GetAction;
  setState?: SetState;
};

export type ActionFunc = (...args: any[]) => (arg: ActionFuncMidArg) => any;

export type Store = {
  state: State;
  action: Action;
};

export type InternalState<T extends State> = {
  [key in keyof T]: T[key];
};

export type InternalAction<T extends Action> = {
  [key in keyof T]: (
    ...args: Parameters<T[key]>
  ) => ReturnType<ReturnType<T[key]>>;
};

export type InternalStore<T extends Store> = {
  state: InternalState<T['state']>;
  action: InternalAction<T['action']>;
};

export interface RootStore {
  [key: string]: Store;
}

export interface ProviderProps {
  children: React.ReactNode;
  store?: RootStore;
}

export const Provider: React.FC<ProviderProps>;

export function useStore<T extends Store>(
  storeName: string,
): [InternalState<T['state']>, InternalAction<T['action']>];

export function defineStore<T extends Store>(store: T): T;
