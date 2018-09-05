import {Action} from "redux";
import {AbstractReducer, IReducerConfig} from "../";

function getReducerMethods <Reducer extends AbstractReducer<State>, State>(reducerInstance: Reducer) {
  const prototype = Object.getPrototypeOf(reducerInstance);
  const methods = Object.getOwnPropertyNames(prototype);

  const getWithRequiredAction = (method: string) => {
  const meta = Reflect.getMetadata("design:paramtypes", prototype, method);
  const action = meta && meta[1];
  return action ? action.prototype.type : undefined;
  };

  return methods
    .filter(getWithRequiredAction)
    .map((method: string) => ({ [getWithRequiredAction(method)]: reducerInstance[method] }))
    .filter((item) => item)
    .reduce((acc: object, current: object) => ({...acc, ...current}), {});
}

interface IMethods<State> {
  [key: string]: (state: State, payload: any) => State;
}

export function createReflectiveReducer <Reducer extends AbstractReducer<State>, State>(
  instance: Reducer, defaultState: State, options: IReducerConfig) {

  const reducers = getReducerMethods<Reducer, State>(instance);

  return (prevState: State = defaultState, action: Action): State => {

    if (options.freezeState) {
      Object.freeze(prevState);
    }

    const fn = reducers[action.type];
    const exists = fn && typeof fn === "function";
    const reducer = exists ? (...args: Array<any>): State => fn.apply(instance, args) : undefined;

    return reducer ? reducer(prevState, action) : prevState;
  };
}
