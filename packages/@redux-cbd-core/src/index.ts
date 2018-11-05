import "reflect-metadata";

import * as React from "react";
import {Action, Dispatch, Reducer, MiddlewareAPI, Store, AnyAction} from "redux";
import {
  connect as originalConnect, ConnectOptions, createProvider, MapDispatchToPropsParam, MapStateToPropsParam,
  MergeProps, Options
} from "react-redux";

export type Constructor<T> = new(...args: Array<any>) => T;
export type ActionHandlerFunc<S, A extends Action> = (s: S, a: A) => S;
export type AsFunctional<S, A extends Action> = (s: S, c: IReducerConfig) => ((prevState: S, action: A) => S );
export type HandlerBundle<T> = { action: string, handler: ActionHandlerFunc<T, any> | AsFunctional<T, any>};
export type ReducerMap<T> = { [index: string]: ActionHandlerFunc<T, any> | AsFunctional<T, any>; }
export type InferableComponentEnhancerWithProps<IInjectedProps, INeedsProps> =
  <IComponent extends React.ComponentType<IInjectedProps & INeedsProps>>(component: IComponent) => IComponent;
export type payloadValue<T extends (...args: Array<any>) => any> = { payload: ReturnType<T> };

export enum EMetaData {
  TYPE = "design:type",
  PARAM_TYPES = "design:paramtypes",
  RETURN_TYPE = "design:returntype",
  ACTION_CLASS = "cbd:actionclass",
  ACTION_TYPE = "cbd:actiontype",
  STORE_MANAGED = "cbd:storemanaged",
  STORE_KEY = "cbd:storekey"
}

export enum EActionClass {
  FUNCTIONAL_ACTION = "FUNCTIONAL_ACTION",
  OBJECT_ACTION = "OBJECT_ACTION",
  SIMPLE_ACTION = "SIMPLE_ACTION",
  COMPLEX_ACTION = "COMPLEX_ACTION",
  ASYNC_ACTION = "ASYNC_ACTION",
  EXCHANGE_ACTION = "EXCHANGE_ACTION"
}

export const getActionType = (action: SimpleAction | (<T extends SimpleAction>(...args: Array<any>) => T) | ((...args: any) => any) | Action) => {
  if (action instanceof SimpleAction) {
    return action.getActionType();
  } else if (Object.prototype.toString.call(action) == '[object Function]') {
    return Reflect.getMetadata(EMetaData.ACTION_TYPE, action);
  } else {
    return (action as Action).type;
  }
};

// ================================================== | Annotations |  =================================================

// @ActionHandler for runtime assertion of declared methods (Only first evaluation).
export const ActionHandler = (customActionType?: string | ((...args: Array<any>) => any)) => <T>(instance: T, method: string) => {

  const secondParam = Reflect.getMetadata("design:paramtypes", instance, method)[1];

  // If custom param is string and second handler param is object.
  if (customActionType && secondParam && secondParam.name === "Object") {
    if (Object.prototype.toString.call(customActionType) == "[object Function]") {
      Reflect.defineMetadata(EMetaData.ACTION_TYPE, Reflect.getMetadata(EMetaData.ACTION_TYPE, customActionType), instance, method)
      return;
    }

    Reflect.defineMetadata(EMetaData.ACTION_TYPE, customActionType, instance, method);
  } else if (customActionType && secondParam && secondParam.name !== "Object") {
    throw new Error("You should not provide action type for already declared action classes.");
  } else if (!secondParam || (!Reflect.getMetadata(EMetaData.ACTION_CLASS, secondParam))) {
    throw new Error(`Wrong second action handler param provided for handling. Reducer: ${instance.constructor.name}, ` +
      `method: ${method}, paramType: ${secondParam && secondParam.name || secondParam}.`);
  }
};

// @ActionWired for storing of 'type' variable class inside metadata.
export const ActionWired = (actionType: string): ((target: any) => any) => {
  return (constructor: (...args: Array<any>) => any ) => {
    Reflect.defineMetadata(EMetaData.ACTION_TYPE, actionType, constructor);
  };
};

// @StoreManaged for marking singleton manager of store with related key.
export const StoreManaged = (storeKey?: string): ((constructor: any) => any) => {

  return <T extends Constructor<{}>>(constructor: T): any => {

    Reflect.defineMetadata(EMetaData.STORE_MANAGED, true, constructor);
    Reflect.defineMetadata(EMetaData.STORE_KEY, storeKey, constructor);

    const originalConstructor: T = constructor;

    const newConstructor = function (...args: Array<any>) {

      if (!originalConstructor.prototype.__INSTANCE__) {
        originalConstructor.prototype.__INSTANCE__ = new originalConstructor(...args);
      }

      return originalConstructor.prototype.__INSTANCE__;
    };

    newConstructor.prototype = originalConstructor.prototype;

    return newConstructor;
  };
};

// @Connect.
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

// For specific purposes. Better use managers' methods for connection.
export function linkReactConnectWithStore<T>(storeKey: string = "store"): IReactComponentConnect<T>  {

  // Don't really care about typing there because we cast it anyway.
  const newConnect = (mapStateToProps: MapStateToPropsParam<any, any, any>,
                      mapDispatchToProps: MapDispatchToPropsParam<any, any>,
                      mergeProps: MergeProps<any, any, any, any>,
                      options: ConnectOptions = {}) => {

    options.storeKey = storeKey;

    return originalConnect(mapStateToProps, mapDispatchToProps, mergeProps, options);
  };

  return newConnect as IReactComponentConnect<T>;

}

// ==================================================== | Actions |  ===================================================

@Reflect.metadata(EMetaData.ACTION_CLASS, EActionClass.SIMPLE_ACTION)
export abstract class SimpleAction implements Action {

  // Mark for correct extending of redux action. '!' marks, that it will be injected lately by middleware.
  public type!: string;

  public readonly payload: object = {};

  public getActionPayload(): object {
    return this.payload;
  }

  // Get action from proto, if someone preferred overload instead of passing @ActionWired.
  public static getActionType(): string {
    return Reflect.getMetadata(EMetaData.ACTION_TYPE, this) || this.prototype.getActionType();
  }

  public getActionType(): string {
    return Reflect.getMetadata(EMetaData.ACTION_TYPE, this.constructor);
  }

}

@Reflect.metadata(EMetaData.ACTION_CLASS, EActionClass.EXCHANGE_ACTION)
export abstract class DataExchangeAction<PayloadType extends object> extends SimpleAction {

  public readonly payload: PayloadType;

  constructor(payload: PayloadType) {
    super();

    this.payload = payload;
  }

}

@Reflect.metadata(EMetaData.ACTION_CLASS, EActionClass.ASYNC_ACTION)
export abstract class AsyncAction<T> extends SimpleAction {

  // Do some complex things after dispatch based on own params.
  public abstract act(): Promise<any>;

  public abstract afterSuccess(result: any): Action;

  public afterError(error: Error): SimpleAction {
    throw new Error(`Async action execution failed: ${this.getActionType()}. Error: ${error.message}.`);
  };

  public getCurrentState(): T {
    throw new Error("State context is not accessible in constructor. Let cbd middleware to process it.");
  }

  public dispatch(action: Action): void {
    throw new Error("State context is not accessible in constructor. Let cbd middleware to process it.");
  }

}

@Reflect.metadata(EMetaData.ACTION_CLASS, EActionClass.COMPLEX_ACTION)
export abstract class ComplexAction<T> extends SimpleAction {

  // Do some complex things after dispatch based on own params.
  public abstract act(): void;

  public getCurrentState(): T {
    throw new Error("State context is not accessible in constructor. Let cbd middleware to process it.");
  }

  public dispatch(action: Action): void {
    throw new Error("State context is not accessible in constructor. Let cbd middleware to process it.");
  }

}

export const FunctionalAction = (type: string) => {
  return (target: any, method: string, descriptor: TypedPropertyDescriptor<any>) => {

    let fn = descriptor.value;

    if (typeof fn !== 'function') {
      throw new Error(`@boundMethod decorator can only be applied to methods not: ${typeof fn}`);
    }

    // In IE11 calling Object.defineProperty has a side-effect of evaluating the
    // getter for the property which is being replaced. This causes infinite
    // recursion and an "Out of stack space" error.
    let definingProperty = false;

    return {
      configurable: true,
      get() {
        if (definingProperty || typeof fn !== 'function') {
          return fn;
        }

        let functionalAction = (...args: Array<any>) => {
          return {
            type: type,
            payload: fn(...args)
          }
        };

        Reflect.defineMetadata(EMetaData.ACTION_CLASS, EActionClass.FUNCTIONAL_ACTION, functionalAction);
        Reflect.defineMetadata(EMetaData.ACTION_TYPE, type, functionalAction);

        definingProperty = true;

        Object.defineProperty(this, method, {
          configurable: true,
          get() {
            return functionalAction;
          },
          set(value) {
            fn = value;
            delete this[method];
          }
        });
        definingProperty = false;
        return functionalAction;
      },
      set(value: (...args: Array<any>) => any) {
        fn = value;
      }
    };
  }
};

// ================================================== | Middlewares |  =================================================

export const cbdMiddleware = (middlewareApi: MiddlewareAPI) => (next: Dispatch) => (action: AnyAction |
  DataExchangeAction<any> | SimpleAction | AsyncAction<any> | ComplexAction<any>) => {

  if (!action || !action.constructor) {
    // We don't handle errors and other things there, let redux or other middlewares do it, also, not class-based items should be skipped.
    return next(action);
  }

  // Fallback to object action, if metadata was not defined.
  const actionType: EActionClass = Reflect.getMetadata(EMetaData.ACTION_CLASS, action.constructor)
    || EActionClass.OBJECT_ACTION;

  switch (actionType) {

    case EActionClass.SIMPLE_ACTION:
    case EActionClass.EXCHANGE_ACTION:
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    case EActionClass.COMPLEX_ACTION:
      (action as ComplexAction<any>).dispatch = middlewareApi.dispatch;
      (action as ComplexAction<any>).getCurrentState = middlewareApi.getState;
      (action as ComplexAction<any>).act();
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    case EActionClass.ASYNC_ACTION:
      (action as AsyncAction<any>).dispatch = middlewareApi.dispatch;
      (action as AsyncAction<any>).getCurrentState = middlewareApi.getState;
      // Async execution after return statement.
      setTimeout(() => (action as AsyncAction<any>).act()
        .then((action as AsyncAction<any>).afterSuccess.bind(action))
        .catch((action as AsyncAction<any>).afterError.bind(action)).then(middlewareApi.dispatch));
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    case EActionClass.OBJECT_ACTION:
    default:
      return next(action);
  }
};

// ===================================================== Reducers ======================================================

export interface IReducerConfig {
  freezeState: boolean;
}

// Disabling to add odd methods for reducer class declaration, only action handlers.
export abstract class ReflectiveReducer<T> {

  [index: string]: ActionHandlerFunc<T, any> | AsFunctional<T, any>;

  public asFunctional(defaultState: T, config: IReducerConfig): Reducer<T, Action> {
    return createReflectiveReducer(this, defaultState, config);
  }

}

function getReducerMethods <Reducer extends ReflectiveReducer<State>, State>(reducerInstance: Reducer): ReducerMap<State> {

  const prototype = Object.getPrototypeOf(reducerInstance);
  const methods = Object.getOwnPropertyNames(prototype)
    .filter((it: string): boolean => it !== "constructor");

  const getMethodActionType = (method: string): string => {

    const metaData = Reflect.getMetadata(EMetaData.PARAM_TYPES, prototype, method);
    const actionClass = metaData && metaData[1];

    const actionType = actionClass && actionClass.name === "Object"
        ? Reflect.getMetadata(EMetaData.ACTION_TYPE, prototype, method)
        : Reflect.getMetadata(EMetaData.ACTION_TYPE, actionClass);

    if (!actionType) {
      throw new Error(`Could not get action type for '${method}'.`);
    }

    return actionType;
  };

  return methods
    .map((method: string): HandlerBundle<State> => ({
      action: getMethodActionType(method),
      handler: reducerInstance[method]
    }))
    .reduce((acc: ReducerMap<State>, current: HandlerBundle<State>) => {

      if (acc[current.action]) {
        throw new Error("Got duplicated action handler for action type: " + current.action);
      } else {
        acc[current.action] = current.handler;
        return acc;
      }
    }, {});
}

// Separate function for reducer creation instead of 'asFunctional' method.
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

export abstract class CBDStoreManager<T> {

  protected store?: Store<T, AnyAction>;

  public constructor() {
    const isStoreManaged: boolean = Reflect.getMetadata(EMetaData.STORE_MANAGED, this.constructor);

    if (!isStoreManaged) {
      throw new Error("You should annotate your store manager with @StoreManaged for usage.");
    }
  }

  public getStoreKey(): string {
    return Reflect.getMetadata(EMetaData.STORE_KEY, this.constructor) || "store";
  };

  public getStore(): Store<T, AnyAction> {

    if (!this.store) {
      this.store = this.createStore();
    }

    return this.store;
  }

  public getProviderComponent(): React.ComponentType {
    return (props: any) => React.createElement(createProvider(this.getStoreKey()), { store: this.getStore() }, props.children);
  };

  public getConsumerAnnotation(): IReactComponentConnect<T> {
    return linkReactConnectWithStore<T>(this.getStoreKey())
  }

  protected abstract createStore(): Store<T, AnyAction>;

}
