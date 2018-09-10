import "reflect-metadata";

import {Action, Dispatch, Store, Reducer} from "redux";
import * as React from "react";
import {connect as originalConnect, MapDispatchToPropsParam, MapStateToPropsParam, MergeProps, Options} from "react-redux";

// === Annotations ===

export const ActionHandler = <T>(instance: T, method: string, descriptor: PropertyDescriptor) => {
  // Just to mark action. Also we can define metainfo there.
};

export const ActionWired = (actionType: string): ((target: any) => any) => {
  return (constructor: (...args: Array<any>) => any ) => {
    constructor.prototype.type = actionType;
  };
};

// === Actions ===

export enum EActionType {
  OBJECT_ACTION = "OBJECT_ACTION",
  SIMPLE_ACTION = "SIMPLE_ACTION",
  COMPLEX_ACTION = "COMPLEX_ACTION",
  ASYNC_ACTION = "ASYNC_ACTION"
}

export abstract class SimpleAction implements Action {

  public static readonly _internalType: EActionType = EActionType.SIMPLE_ACTION;
  public static readonly type: string;

  public static getInternalType(): EActionType {
    return this._internalType;
  }

  public readonly type: string;
  protected payload: object = {};

  public constructor() {
    this.type = this.getActionType();
  }

  public getActionPayload(): object {
    return this.payload;
  }

  public getActionType(): string {
    return Object.getPrototypeOf(this).type;
  }

}

export abstract class AsyncAction extends SimpleAction {

  public static readonly _internalType: EActionType = EActionType.ASYNC_ACTION;

  public constructor() {
    super();
  }

  // Do some complex things after dispatch based on own params.
  public abstract act(): Promise<any>;

  public abstract afterSuccess(result: any): SimpleAction;

  public afterError(error: Error): SimpleAction {
    throw new Error(`Async action execution failed: ${this.getActionType()}. Error: ${error.message}.`);
  };

}

export abstract class ComplexAction extends SimpleAction {

  public static readonly _internalType: EActionType = EActionType.COMPLEX_ACTION;

  public constructor() {
    super();
  }

  // Do some complex things after dispatch based on own params.
  public abstract act(): void;

}

// === Middlewares ===

export const cbdMiddleware = (store: Store) => (next: Dispatch) => (action: SimpleAction & AsyncAction
  & ComplexAction) => {

  const actionType: EActionType = (Object.getPrototypeOf(action).constructor.getInternalType &&
    Object.getPrototypeOf(action).constructor.getInternalType()) || EActionType.OBJECT_ACTION;

  switch (actionType) {

    case EActionType.SIMPLE_ACTION:
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    case EActionType.COMPLEX_ACTION:
      action.act();
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    case EActionType.ASYNC_ACTION:
      setTimeout(() => action.act().then(action.afterSuccess).catch(action.afterError).then(store.dispatch));
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    default:
      return next(action);
  }
};

// === Reducers ===

export interface IReducerConfig {
  freezeState: boolean;
}

export type actionHandlerFunc<T> = (s: T, a: SimpleAction) => T;
export type asFunctional<T> = (s: T, c: IReducerConfig) => ((prevState: T, action: SimpleAction) => T );
export type reducerMap<T> = {
  [index: string]: actionHandlerFunc<T> | asFunctional<T>
}

export abstract class ReflectiveReducer<T> {

  [index: string]: actionHandlerFunc<T> | asFunctional<T>;

  public asFunctional(defaultState: T, config: IReducerConfig): Reducer<T, Action> {
    return createReflectiveReducer(this, defaultState, config);
  }

}

// === Reducers ===

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

// === @Connect ===

export type InferableComponentEnhancerWithProps<IInjectedProps, INeedsProps> =
  <IComponent extends React.ComponentType<IInjectedProps & INeedsProps>>(component: IComponent) => IComponent;

export interface IReactComponentConnect<T> {
  <IStateProps = {}, IDispatchProps = {}, IOwnProps = {}>(
    mapStateToProps?: MapStateToPropsParam<IStateProps, IOwnProps, T>,
    mapDispatchToProps?: MapDispatchToPropsParam<IDispatchProps, IOwnProps>,
  ): InferableComponentEnhancerWithProps<IStateProps & IDispatchProps, IOwnProps>;

  <IStateProps = {}, IDispatchProps = {}, IOwnProps = {}, IMergedProps = {}>(
    mapStateToProps?: MapStateToPropsParam<IStateProps, IOwnProps, T>,
    mapDispatchToProps?: MapDispatchToPropsParam<IDispatchProps, IOwnProps>,
    mergeProps?: MergeProps<IStateProps, IDispatchProps, IOwnProps, IMergedProps>,
    options?: Options<IStateProps, IOwnProps, IMergedProps>,
  ): InferableComponentEnhancerWithProps<IMergedProps, IOwnProps>;
}

export function linkReactConnectWithStore<T>() {
  return originalConnect as IReactComponentConnect<T>;
}