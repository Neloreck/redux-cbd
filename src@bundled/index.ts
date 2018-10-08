import "reflect-metadata";

import * as React from "react";
import {ComponentType, Component, PureComponent, ReactNode, Fragment} from "react";

import {Action, Dispatch, Reducer, MiddlewareAPI, Store} from "redux";
import {
  connect as originalConnect,
  ConnectOptions, createProvider,
  MapDispatchToPropsParam,
  MapStateToPropsParam,
  MergeProps,
  Options, Provider
} from "react-redux";

// General related.

// === Types ===

export type Constructor<T> = new(...args: Array<any>) => T;

export enum EMetaData {
  TYPE = "design:type",
  PARAM_TYPES = "design:paramtypes",
  RETURN_TYPE = "design:returntype",
  ACTION_CLASS = "cbd:actionclass",
  ACTION_TYPE = "cbd:actiontype",
  STORE_MANAGED = "cbd:storemanaged",
  STORE_KEY = "cbd:storekey"
}

// === Annotations ===

export { default as AutoBind } from "autobind-decorator";

export function Single<T extends Constructor<{}>>(target: T): any {

  const originalConstructor: T = target;

  const newConstructor = function (...args: Array<any>) {

    if (!originalConstructor.prototype.__INSTANCE__) {
      originalConstructor.prototype.__INSTANCE__ = new originalConstructor(...args);
    }

    return originalConstructor.prototype.__INSTANCE__;
  };

  newConstructor.prototype = originalConstructor.prototype;

  return newConstructor;
}

// === Utils ===

export class ReflectUtils {

  public static getClassPropertyType(instance: any, key: string): string {
    return Reflect.getMetadata(EMetaData.TYPE, instance, key);
  }

  public static getClassMethodReturnType(instance: any, key: string): string {
    return Reflect.getMetadata(EMetaData.RETURN_TYPE, instance, key);
  }

  public static getClassMethodParamTypes(instance: any, key: string): { [idx: number]: any } {
    return Reflect.getMetadata(EMetaData.PARAM_TYPES, instance, key);
  }

}

export class TypeUtils {

  // Runtime type check.

  public static isString(value: any): boolean {
    return (Object.prototype.toString.call(value) === "[object String]");
  }

  public static isArray(value: any): boolean {
    return (Object.prototype.toString.call(value) === "[object Array]");
  }

  public static isBoolean(value: any): boolean {
    return (Object.prototype.toString.call(value) === "[object Boolean]");
  }

  public static isNumber(value: any): boolean {
    return ((Object.prototype.toString.call(value) === "[object Number]") && Number.isFinite(value));
  }

  public static isInteger(value: any): boolean {
    return ((Object.prototype.toString.call(value) === "[object Number]") && Number.isFinite(value) && !(value % 1));
  }

  public static isFunction(value: any): boolean {
    return (value && Object.prototype.toString.call(value) == '[object Function]');
  }

  public static isObject(value: any): boolean {
    return (value === Object(value));
  }

  // Reflect isType.

  public static isArrayType(target: any): boolean {
    return (target === Array);
  }

  public static isBooleanType(target: any): boolean {
    return (target === Boolean);
  }

  public static isNumberType(target: any): boolean {
    return (target === Number);
  }

  public static isStringType(target: any): boolean {
    return (target === String);
  }

  public static isVoidType(target: any): boolean {
    return (target === undefined);
  }

  public static isAnyType(target: any): boolean {
    return (target === Object(target));
  }

}

// React related.

// === Annotations ===

export function Wrapped<ComponentProps1, ComponentProps2>(
  WrapComponent: ComponentType<ComponentProps1>, wrapProps?: ComponentProps1) {

  return (Target: ComponentType<ComponentProps2>): any => class extends PureComponent {

    public render(): ReactNode {
      return React.createElement(WrapComponent, wrapProps, [React.createElement(Target, this.props as ComponentProps2)]);
    }

  };

}

// === Utils ===

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
          ? React.createElement(this.state.component, this.props)
          : loadingMarkup;
      }

    }

    return LazyComponent;
  }

}

// Redux related.

// === Annotations ===

// Runtime assertion.
export const ActionHandler = <T>(instance: T, method: string, descriptor: PropertyDescriptor) => {

  const secondParam = Reflect.getMetadata("design:paramtypes", instance, method)[1];

  if (!secondParam || !Reflect.getMetadata(EMetaData.ACTION_CLASS, secondParam)) {
    throw new Error(`Wrong second action handler param provided for handling. Reducer: ${instance.constructor.name}, ` +
      `method: ${method}, paramType: ${secondParam && secondParam.name || secondParam}.`);
  }

};

export const ActionWired = (actionType: string): ((target: any) => any) => {
  return (constructor: (...args: Array<any>) => any ) => {
    Reflect.defineMetadata(EMetaData.ACTION_TYPE, actionType, constructor);
  };
};

export const StoreManaged = (storeKey?: string): ((constructor: any) => any) => {

  return function StoreManaged<T extends Constructor<{}>>(constructor: T): any {

    Reflect.defineMetadata(EMetaData.STORE_MANAGED, true, constructor);
    Reflect.defineMetadata(EMetaData.STORE_KEY, storeKey, constructor);

    return Single(constructor);
  };
};


// === Actions ===

export enum EActionClass {
  OBJECT_ACTION = "OBJECT_ACTION",
  SIMPLE_ACTION = "SIMPLE_ACTION",
  COMPLEX_ACTION = "COMPLEX_ACTION",
  ASYNC_ACTION = "ASYNC_ACTION"
}

@Reflect.metadata(EMetaData.ACTION_CLASS, EActionClass.SIMPLE_ACTION)
export abstract class SimpleAction implements Action {

  public type!: string;

  protected payload: object = {};

  public getActionPayload(): object {
    return this.payload;
  }

  public getActionType(): string {
    return Reflect.getMetadata(EMetaData.ACTION_TYPE, this.constructor);
  }

}

@Reflect.metadata(EMetaData.ACTION_CLASS, EActionClass.ASYNC_ACTION)
export abstract class AsyncAction extends SimpleAction {

  // Do some complex things after dispatch based on own params.
  public abstract act(): Promise<any>;

  public abstract afterSuccess(result: any): SimpleAction;

  public afterError(error: Error): SimpleAction {
    throw new Error(`Async action execution failed: ${this.getActionType()}. Error: ${error.message}.`);
  };

}

@Reflect.metadata(EMetaData.ACTION_CLASS, EActionClass.COMPLEX_ACTION)
export abstract class ComplexAction extends SimpleAction {

  public static readonly _internalType: EActionClass = EActionClass.COMPLEX_ACTION;

  // Do some complex things after dispatch based on own params.
  public abstract act(): void;

}

// === Middlewares ===

export const cbdMiddleware = (middlewareApi: MiddlewareAPI) => (next: Dispatch) => (action: SimpleAction & AsyncAction
  & ComplexAction) => {

  const actionType: EActionClass = Reflect.getMetadata(EMetaData.ACTION_CLASS, action.constructor) || EActionClass.OBJECT_ACTION;

  switch (actionType) {

    case EActionClass.SIMPLE_ACTION:
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    case EActionClass.COMPLEX_ACTION:
      action.act();
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    case EActionClass.ASYNC_ACTION:
      setTimeout(() => action.act().then(action.afterSuccess).catch(action.afterError).then(middlewareApi.dispatch));
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    default:
      return next(action);
  }
};

// === Reducers ===

export interface IReducerConfig {
  freezeState: boolean;
}

export type actionHandlerFunc<T> = (s: T, a: any) => T;
export type asFunctional<T> = (s: T, c: IReducerConfig) => ((prevState: T, action: SimpleAction) => T );
export type reducerMap<T> = {
  [index: string]: (<A> (s: T, a: A) => T ) | asFunctional<T>;
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

  const getWithRequiredAction = (method: string): string => {
    const meta = Reflect.getMetadata(EMetaData.PARAM_TYPES, prototype, method);
    const action = meta && meta[1];

    return action ? Reflect.getMetadata(EMetaData.ACTION_TYPE, action) : undefined;
  };

  return methods
    .map((method: string) => ({ [getWithRequiredAction(method)]: reducerInstance[method] }))
    .filter((item) => !item["undefined"])
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

export abstract class CBDStoreManager<T> {

  protected store?: Store<T, Action<any>>;

  public constructor() {
    const isStoreManaged: boolean = Reflect.getMetadata(EMetaData.STORE_MANAGED, this.constructor);

    if (!isStoreManaged) {
      throw new Error("You should decorate your store manager with @StoreManaged to provide store key and signleton pattern.");
    }
  }

  public getStoreKey(): string {
    return Reflect.getMetadata(EMetaData.STORE_KEY, this.constructor) || "store";
  };

  protected abstract createStore(): Store<T, Action<any>>;

  public getStore(): Store<T, Action<any>> {

    if (!this.store) {
      this.store = this.createStore();
    }

    return this.store;
  }

  public getProvider(): React.ComponentType {
    return (props: any) =>  React.createElement(Fragment, {},
      React.createElement(createProvider(this.getStoreKey()), { store: this.getStore() }, props.children));
  };

  public getConsumerAnnotation(): any {
    return linkReactConnectWithStore<T>(this.getStoreKey())
  }

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
