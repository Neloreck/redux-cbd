import {Action, Reducer} from "redux";
import {ReflectiveReducer, IReducerConfig} from "../reducers";
import {reducerMap} from "../reducers/ReflectiveReducer";

function getReducerMethods <Reducer extends ReflectiveReducer<State>, State>(reducerInstance: Reducer): reducerMap<State> {
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

export function createReflectiveReducer <ReducerType extends ReflectiveReducer<StateType>, StateType>(
  reducerInstance: ReducerType, defaultState: StateType, options: IReducerConfig): Reducer<StateType, Action> {

  const reducersMethods = getReducerMethods<ReducerType, StateType>(reducerInstance);

  return (prevState: StateType = defaultState, action: Action): StateType => {

    if (options.freezeState) {
      Object.freeze(prevState);
    }

    const fn = reducersMethods[action.type];
    const exists = fn && typeof fn === "function";
    const reducer = exists ? (...args: Array<any>): StateType => fn.apply(reducerInstance, args) : undefined;

    return reducer ? reducer(prevState, action) : prevState;
  };
}
