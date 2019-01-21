import "reflect-metadata";

import * as React from "react";
import {ComponentType, Component, PureComponent, ReactNode, Fragment} from "react";
import {Action, Dispatch, Reducer, MiddlewareAPI, Store} from "redux";
import {
  connect as originalConnect, ConnectOptions, createProvider, MapDispatchToPropsParam, MapStateToPropsParam,
  MergeProps, Options
} from "react-redux";

// ===================================================== | Types | =====================================================
export interface IReducerConfig {
  freezeState: boolean;
}

export type Constructor<T> = new(...args: Array<any>) => T;
export type ActionHandlerFunc<S, A extends Action> = (s: S, a: A) => S;
export type AsFunctional<S, A extends Action> = (s: S, c: IReducerConfig) => ((prevState: S, action: A) => S );
export type HandlerBundle<T> = { action: string, handler: ActionHandlerFunc<T, any> | AsFunctional<T, any>};
export type ReducerMap<T> = { [index: string]: ActionHandlerFunc<T, any> | AsFunctional<T, any>; }
export type InferableComponentEnhancerWithProps<IInjectedProps, INeedsProps> =
  <IComponent extends React.ComponentType<IInjectedProps & INeedsProps>>(component: IComponent) => IComponent;

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
  OBJECT_ACTION = "OBJECT_ACTION",
  SIMPLE_ACTION = "SIMPLE_ACTION",
  COMPLEX_ACTION = "COMPLEX_ACTION",
  ASYNC_ACTION = "ASYNC_ACTION",
  EXCHANGE_ACTION = "EXCHANGE_ACTION"
}

// ================================================== | Annotations |  =================================================

// @Single for singleton objects.
export const Single = () => <T extends  new(...args: Array<any>) => {}>(target: T): any => {

  const originalConstructor: T = target;

  const newConstructor = Object.assign(function (...args: Array<any>) {

    // @ts-ignore
    if (!originalConstructor.__INSTANCE__) {
      // @ts-ignore
      originalConstructor.__INSTANCE__ = new originalConstructor(...args);
    }

    // @ts-ignore
    return originalConstructor.__INSTANCE__;
  }, target);

  newConstructor.prototype = originalConstructor.prototype;

  return newConstructor;
};

// @EntryPoint for application entry.
export const EntryPoint = (targetClass: { main: () => void } ): void  => {

  if (targetClass.main) {
    targetClass.main();
  } else {
    throw new Error("Entrypoint not found - 'public static main(): void'.");
  }

};

// @Wrapped component declaration.
export function Wrapped<ComponentProps1, ComponentProps2>(
  WrapComponent: ComponentType<ComponentProps1>, wrapProps?: ComponentProps1) {

  return (Target: ComponentType<ComponentProps2>): any => class extends PureComponent {

    public render(): ReactNode {
      return React.createElement(WrapComponent, wrapProps, React.createElement(Target, this.props as ComponentProps2));
    }

  };

}

// @Bind class methods.
export {default as Bind} from "autobind-decorator";

// @ActionHandler for runtime assertion of declared methods (Only first evaluation).
export const ActionHandler = (customActionType?: string) => <T>(instance: T, method: string) => {

  const secondParam = Reflect.getMetadata("design:paramtypes", instance, method)[1];

  if (customActionType && secondParam && secondParam.name === "Object") {
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

    return Single()(constructor);
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

// ================================================== | Middlewares |  =================================================

export const cbdMiddleware = (middlewareApi: MiddlewareAPI) => (next: Dispatch) => (action: Action &
  DataExchangeAction<any> & SimpleAction & AsyncAction<any> & ComplexAction<any>) => {

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
      action.act();
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    case EActionClass.ASYNC_ACTION:
      (action as AsyncAction<any>).dispatch = middlewareApi.dispatch;
      (action as AsyncAction<any>).getCurrentState = middlewareApi.getState;
      // Async execution after return statement.
      setTimeout(() => action.act().then(action.afterSuccess.bind(action)).catch(action.afterError.bind(action)).then(middlewareApi.dispatch));
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    case EActionClass.OBJECT_ACTION:
    default:
      return next(action);
  }
};

// ===================================================== Reducers ======================================================

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

  protected store?: Store<T, Action<any>>;

  public constructor() {
    const isStoreManaged: boolean = Reflect.getMetadata(EMetaData.STORE_MANAGED, this.constructor);

    if (!isStoreManaged) {
      throw new Error("You should annotate your store manager with @StoreManaged for usage.");
    }
  }

  public getStoreKey(): string {
    return Reflect.getMetadata(EMetaData.STORE_KEY, this.constructor) || "store";
  };

  public getStore(): Store<T, Action<any>> {

    if (!this.store) {
      this.store = this.createStore();
    }

    return this.store;
  }

  public getProviderComponent(): React.ComponentType {
    return (props: any) =>  React.createElement(Fragment, {},
      React.createElement(createProvider(this.getStoreKey()), { store: this.getStore() }, props.children));
  };

  public getConsumerAnnotation(): IReactComponentConnect<T> {
    return linkReactConnectWithStore<T>(this.getStoreKey())
  }

  protected abstract createStore(): Store<T, Action<any>>;

}

// ===================================================== | Utils |  ====================================================

export interface ILazyComponentState {
  component: ComponentType;
}

export class LazyLoadComponentFactory {

  public static getLazyComponent(importFunc: () => Promise<any>, loadingMarkup?: JSX.Element, componentNamedExport?: string): ComponentType {

    // tslint:disable-next-line
    class LazyComponent extends Component<any, ILazyComponentState, any> {

      private static __COMPONENT_INSTANCE__: ComponentType;

      public state: ILazyComponentState = {
        component: LazyComponent.__COMPONENT_INSTANCE__
      };

      private mounted: boolean = false;

      public async componentWillMount(): Promise<void> {

        const RenderComponent: ComponentType = this.state.component;

        if (!RenderComponent) {
          const module: any = await importFunc();
          const ImportedRenderComponent: ComponentType = module[componentNamedExport || Object.keys(module)[0]];

          LazyComponent.__COMPONENT_INSTANCE__ = ImportedRenderComponent;

          if (this.mounted) {
            this.setState({component: ImportedRenderComponent});
          }
        }
      }

      public componentDidMount(): void {
        this.mounted = true;

        if (!this.state.component) {
          this.setState({component: LazyComponent.__COMPONENT_INSTANCE__});
        }
      }

      public componentWillUnmount(): void {
        this.mounted = false;
      }

      public render(): ReactNode | null {
        return this.state.component
          ? React.createElement(this.state.component, this.props as any)
          : loadingMarkup;
      }

    }

    return LazyComponent;
  }

}
