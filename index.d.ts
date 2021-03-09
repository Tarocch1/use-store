import * as React from 'react';

export type DefinedState = {
  [key: string]: any;
};

export type DefinedAction = {
  [key: string]: DefinedActionFunction;
};

export type GetState = <T extends DefinedStore>(
  storeName: string,
) => State<T['state']>;
export type GetAction = <T extends DefinedStore>(
  storeName: string,
) => Action<T['action']>;
export type SetState = <T extends DefinedStore>(
  newState: Partial<State<T['state']>>,
) => void;

export type DefinedActionFunctionMidArg = {
  getState?: GetState;
  getAction?: GetAction;
  setState?: SetState;
};

export type DefinedActionFunction = (
  ...args: any[]
) => (arg: DefinedActionFunctionMidArg) => void;

export type DefinedStore = {
  state: DefinedState;
  action: DefinedAction;
};

export type State<T extends DefinedState> = {
  [key in keyof T]: T[key];
};

export type Action<T extends DefinedAction> = {
  [key in keyof T]: (
    ...args: Parameters<T[key]>
  ) => ReturnType<ReturnType<T[key]>>;
};

export type Store<T extends DefinedStore> = {
  state: State<T['state']>;
  action: Action<T['action']>;
};

export interface RootStore {
  [key: string]: DefinedStore;
}

export interface ProviderProps {
  children: React.ReactNode;
  store?: RootStore;
}

export const Provider: React.FC<ProviderProps>;

export function useStore<T extends DefinedStore>(
  storeName: string,
): [State<T['state']>, Action<T['action']>];
