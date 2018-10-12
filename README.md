# <a href='https://www.npmjs.com/package/redux-cbd'> 🗻 Redux CBD </a>

[![start with wiki](https://img.shields.io/badge/docs-wiki-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/wiki)
[![npm version](https://img.shields.io/npm/v/redux-cbd.svg?style=flat-square)](https://www.npmjs.com/package/redux-cbd)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/blob/master/LICENSE)
<br/>
[![language-ts](https://img.shields.io/badge/language-typescript%3A%2099%25-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/search?l=typescript)
<br/>
[![dependencies Status](https://david-dm.org/neloreck/redux-cbd/status.svg)](https://david-dm.org/neloreck/redux-cbd)
[![devDependencies Status](https://david-dm.org/neloreck/redux-cbd/dev-status.svg)](https://david-dm.org/neloreck/redux-cbd?type=dev)
<br/>
[![Build Status](https://travis-ci.org/Neloreck/redux-cbd.svg?branch=master)](https://travis-ci.org/Neloreck/redux-cbd)
<br/>
[![npm downloads](https://img.shields.io/npm/dm/redux-cbd.svg?style=flat-square)](https://www.npmjs.com/package/redux-cbd)
[![HitCount](http://hits.dwyl.com/neloreck/redux-cbd.svg)](http://hits.dwyl.com/neloreck/redux-cbd)

<hr/>

Typescript decorators\annotations, utils and abstract classes for <a href='https://github.com/facebook/react'>react</a>-<a href='https://github.com/reduxjs/redux'>redux</a> application. <br/>
Adds various utility annotations such as @Single, @EntryPoint, @Connect or @Wrapped. <br/>
Allows you to write class-based declarations of your data storage with strict and predictive typing. <br/>
Enforces typesafety and OOP mixed with functional style (all key features and implementation of redux remains the same). <br/>
Adds Reflection, Type/Reflect utils for runtime typechecking.

Intended to be used with react-redux.

<hr/>

## Installation

`npm install --save redux-cbd`


<b>Important:</b>
- Package uses proposal ES <a href='https://github.com/rbuckton/reflect-metadata'>reflect-metadata</a> api, so I'd advice to get acknowledged with its usage.
- Package uses 'expirementalDecorators' features (disabled by default for TypeScript transpiler).

## Setup
    
    1) Install package.
    2) Inject 'reflect-metadata' into your bundle (webpack entry or import inside your entryfile).
    3) Configure typescript. You should turn on "emitDecoratorMetadata" and "experimentalDecorators" for compiler.
    4) Create some actions (extend simple, complex, async) with @ActionWired annotation.
    5) Create related reducer(extend ReflectiveReducer) with proper @ActionHandlers.
    6) Create rootReducer that includes reflectiveReducers. Declare storeState interface.
    7) Create store based on root reducer. Extend CBDStoreManager, annotate @StoreManaged. Include cbdMiddleware there.
    8) Create @StoreConnect decorator.
    9) Connect component => use props and actions from declarative storage.

tsconfig.json part: <br/>
```typescript
{
  "compilerOptions": {
    "emitDecoratorMetadata": true, 
    "experimentalDecorators": true
  }
}
```
<hr/>

## What is inside

| [Annotations](https://github.com/Neloreck/redux-cbd/wiki/Annotations) | [Actions](https://github.com/Neloreck/redux-cbd/wiki/Actions) | [Reducers](https://github.com/Neloreck/redux-cbd/wiki/Reducers) | [Middleware](https://github.com/Neloreck/redux-cbd/wiki/Middleware) | [Utils](https://github.com/Neloreck/redux-cbd/wiki/Utils)|
| :------------- | :------------- | :------------- | :------------- | :------------- |
| [@Single](https://github.com/Neloreck/redux-cbd/wiki/@Single) | [SimpleAction](https://github.com/Neloreck/redux-cbd/wiki/SimpleAction) | [ReflectiveReducer](https://github.com/Neloreck/redux-cbd/wiki/ReflectiveReducer) | [cbdMiddleware](https://github.com/Neloreck/redux-cbd/wiki/cbdMiddleware) | [createReflectiveReducer](https://github.com/Neloreck/redux-cbd/wiki/createReflectiveReducer) |
| [@EntryPoint](https://github.com/Neloreck/redux-cbd/wiki/@EntryPoint) | [DataExchangeAction](https://github.com/Neloreck/redux-cbd/wiki/DataExchangeAction) | [IReducerConfig](https://github.com/Neloreck/redux-cbd/wiki/IReducerConfig) | - | [linkReactConnectWithStore](https://github.com/Neloreck/redux-cbd/wiki/linkReactConnectWithStore) |
| [@AutoBind](https://github.com/Neloreck/redux-cbd/wiki/@AutoBind) | [ComplexAction](https://github.com/Neloreck/redux-cbd/wiki/ComplexAction) | [CBDStoreManager](https://github.com/Neloreck/redux-cbd/wiki/CBDStoreManager) | - | [LazyComponentFactory](https://github.com/Neloreck/redux-cbd/wiki/LazyComponentFactory) |
| [@Wrapped](https://github.com/Neloreck/redux-cbd/wiki/@Wrapped) | [AsyncAction](https://github.com/Neloreck/redux-cbd/wiki/AsyncAction) | - | - | [TypeUtils](https://github.com/Neloreck/redux-cbd/wiki/TypeUtils) |
| [@StoreManaged](https://github.com/Neloreck/redux-cbd/wiki/@StoreManaged) | - | - | - | [ReflectUtils](https://github.com/Neloreck/redux-cbd/wiki/ReflectUtils) |
| [@ActionWired](https://github.com/Neloreck/redux-cbd/wiki/@ActionWired) | - | - | - | - |
| [@ActionHandler](https://github.com/Neloreck/redux-cbd/wiki/@StoreManaged) | - | - | - | - |

## Example (wiki contains more explanations):

### Application entrypoint:
```typescript jsx
import * as React from "react";
import {render} from "react-dom";
import {EntryPoint} from "redux-cbd";

import {GlobalStoreProvider} from "./data/redux";
import {ConnectedComponent, IConnectedComponentExternalProps} from "./view/ConnectedComponent";

@EntryPoint
export class Application {

  /*
   * { ...{} as IConnectedComponentExternalProps } is the trick for correct types handling.
   * Actually, connected component is different from the one we exported with 'export class'.
   * We should use default export with separate props cast or make such mock trick.
   * (I prefer second style with single class declaration and DIRECTLY NAMED imports, which are better as for me).
   *
   * Also, you can wrap your <Root/> element with '@Wrapped(GlobalStoreProvider)' (check wiki for details).
   */
  public static main(): void {
    render( <GlobalStoreProvider>
      <ConnectedComponent someLabelFromExternalProps={ "Demo prop" } { ...{} as IConnectedComponentExternalProps }/>
    </GlobalStoreProvider>, document.getElementById("application-root"));
  }

}

```

### Store, provider and connect creations:

```typescript jsx
import {GlobalStoreManager} from "./GlobalStoreManager";
import {IGlobalStoreState} from "./IGlobalStoreState";

/* Global store state typing, includes reducers for this one (can exist multiple stores in our app). */
export {IGlobalStoreState} from  "./IGlobalStoreState";
/* Singleton store manager. Creates store, providers, contains some info about store. */
export const globalStoreManager: GlobalStoreManager = new GlobalStoreManager();
/* Global store provider wrapper, provides correct store and store key for connection. No need to manage store manually. */
export const GlobalStoreProvider = globalStoreManager.getProviderComponent();
/* @Connect decorator annotation linked to global store, components can be wrapped in multiple connects with different stores. */
export const GlobalStoreConnect = globalStoreManager.getConsumerAnnotation();

```


### State declarations:

```typescript jsx
/* State for demo reducer store. */
/* Class over interface for default init. Will transform to simple object after redux processing. */
export class DemoReducerState {

  public storedNumber: number = 0;
  public loading: boolean = false;

}

/* State for global store. */
export interface IGlobalStoreState {
  demoReducer: DemoReducerState;
}

```

### Our demo reducer:

```typescript jsx
import {ActionHandler, ReflectiveReducer} from "redux-cbd";

import {AsyncDemoAction, AsyncDemoActionSuccess, ComplexDemoAction, SimpleDemoAction, DataExchangeDemoAction} from "../actions";
import {DemoReducerState} from "../state/DemoReducerState";

// Reducer class. Typing allows you to create ONLY methods with two params - <genericState, actionType>.
// Looks for method with same action type and executes it. Just like functional reducer with switch but better.
// @ActionHandler is not required. Method name does not influence on behaviour.
// Same action handlers are not allowed inside one class.
export class DemoReducer extends ReflectiveReducer<DemoReducerState>  {

  @ActionHandler
    public changeStoredNumber(state: DemoState, action: SimpleDemoAction): DemoState {
      return { ...state, storedNumber: action.payload.storedNumber };
    }
  
    @ActionHandler
    public exchangeSomeData(state: DemoState, action: DataExchangeDemoAction): DemoState {
      return { ...state, storedNumber: action.payload.storedNumber };
    }
  
    @ActionHandler
    public startLoadingOnAsyncActionReceived(state: DemoState, action: AsyncDemoAction): DemoState {
      return { ...state, loading: action.payload.loading };
    }
  
    @ActionHandler
    public finishFakeLoading(state: DemoState, action: AsyncDemoActionSuccess): DemoState {
      return { ...state, storedNumber: action.payload.storedNumber, loading: false };
    }
  
    @ActionHandler
    public handleComplexAction(state: DemoState, action: ComplexDemoAction): DemoState {
      return { ...state, storedNumber: action.payload.storedNumber };
    }

}

```

### Our actions for reducer methods (considered to be separate class-files, you know):

```typescript jsx
import {ActionWired, AsyncAction, SimpleAction, DataExchangeAction} from "redux-cbd";


@ActionWired("DATA_EXCHANGE_TEST_ACTION")
export class DataExchangeDemoAction extends DataExchangeAction<{ storedNumber: number }> {}

@ActionWired("SIMPLE_TEST_ACTION")
export class SimpleDemoAction extends SimpleAction {

  public payload: { storedNumber: number } = { storedNumber: 0 };

  public constructor(num: number) {
    super();

    this.payload.storedNumber = num;
  }

}

@ActionWired("ASYNC_TEST_ACTION_SUCCESS")
export class AsyncDemoActionSuccess extends SimpleAction {

  public payload: { loading: boolean, storedNumber: number } = { loading: true, storedNumber: -1 };

  public constructor(num: number) {
    super();
    
    this.payload.storedNumber = num;
  }
  
}

@ActionWired("ASYNC_TEST_ACTION")
export class AsyncDemoAction extends AsyncAction {

  public payload: { loading: boolean } = { loading: true };

  private readonly delay: number;

  public constructor(delay: number) {
    super();

    this.payload.loading = true;
    this.delay = delay;
  }

  public async act(): Promise<number> {
    const forMillis = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

    await forMillis(this.delay);
    return Math.random();
  }

  public afterSuccess(num: number): AsyncDemoActionSuccess {
    return new AsyncDemoActionSuccess(num);
  }

  /*  public afterError(error: Error) { return new .......... } */

}

@ActionWired("COMPLEX_TEST_ACTION")
export class ComplexDemoAction extends ComplexAction {

  public payload: { storedNumber: number } = { storedNumber: 0 };

  public constructor(num: number) {
    super();

    this.payload.storedNumber = num;
  }

  public act(): void {
    this.payload.storedNumber *= 1000 + 500 * Math.random();
  }

}

```

### Global store manager:
```typescript jsx
import {Action, combineReducers, Store, applyMiddleware, createStore, Middleware, Reducer} from "redux";
import {StoreManaged, CBDStoreManager, cbdMiddleware} from "redux-cbd";

/* Custom middlewares. */
import {logInConnectedComponentMiddleware, logInConsoleMiddleware} from "../../view/logInMiddlewares";

/* Store state, that includes smaller reducers. */
import {IGlobalStoreState} from "./IGlobalStoreState";

/* Some Reducers declaration. */
import {DemoReducerState} from "../demo/state/DemoReducerState";
import {DemoReducer} from "../demo/reducer/DemoReducer";

@StoreManaged("GLOBAL_STORE")
export class GlobalStoreManager extends CBDStoreManager<IGlobalStoreState> {

  // Creating store. Singleton instance for whole app. cbdMiddleware is important there, logs are for demo.
  protected createStore(): Store<IGlobalStoreState, Action<any>> {
    const middlewares: Array<Middleware> = [cbdMiddleware, logInConnectedComponentMiddleware, logInConsoleMiddleware];
    return createStore(this.createRootReducer(), applyMiddleware(...middlewares));
  }

  // Creating root reducer based on our application global state.
  // Recommend to create model/module related ones instead of page-related. For example: auth, userSetting etc.
  private createRootReducer(): Reducer<IGlobalStoreState> {
    return combineReducers( {
      demoReducer: new DemoReducer().asFunctional(new DemoReducerState(), { freezeState: true })
    });
  }

}

```

### Connected component

```typescript jsx
import * as React from "react";
import {PureComponent} from "react";
import {Action} from "redux";

// Store related things.
import {GlobalStoreConnect, IGlobalStoreState} from "../data";
import {AsyncDemoAction, SimpleDemoAction, ComplexDemoAction, DataExchangeDemoAction} from "../data/demo/actions";

// Props, that are injected from connect store.
interface IConnectedComponentStoreProps {
  demoLoading: boolean;
  demoNumber: number;
}

// Props, mapped and injected as actions creators.
interface IConnectedComponentDispatchProps {
  simpleDemoAction: (num: number) => SimpleDemoAction;
  asyncDemoAction: (num: number) => AsyncDemoAction;
  complexDemoAction: (num: number) => ComplexDemoAction;
  dataExchangeDemoAction: (num: number) => DataExchangeDemoAction;
}

// Own props, that are passed with manual component/container creations.
// Router-managed components are not so complicated because we don't create them manually.
export interface IConnectedComponentOwnProps {
  someLabelFromExternalProps: string;
}

// External props, that are injected by different decorators.
// For example: @Connect, @withStyles (material ui), @withWrapper (provide some props with HOC by decorator usage) etc.
export interface IConnectedComponentExternalProps extends IConnectedComponentStoreProps,
  IConnectedComponentDispatchProps {}

// General props for whole component for overall picture, everything can be accessed from the inside.
export interface IConnectedComponentProps extends IConnectedComponentOwnProps, IConnectedComponentExternalProps {}

// Link global store provider with component. This props will be injected automatically and should be type safe.
@GlobalStoreConnect<IConnectedComponentStoreProps, IConnectedComponentDispatchProps, IConnectedComponentProps>(
  (store: IGlobalStoreState) => {
    return {
      demoLoading: store.demoReducer.loading,
      demoNumber: store.demoReducer.storedNumber
    };
  }, {
    simpleDemoAction: (num: number) => new SimpleDemoAction(num),
    complexDemoAction: (num: number) => new ComplexDemoAction(num),
    asyncDemoAction: (num: number) => new AsyncDemoAction(num),
    dataExchangeDemoAction: (num) => new DataExchangeDemoAction({ storedNumber: num })
  })
export class ConnectedComponent extends PureComponent<IConnectedComponentProps> {

  public static readonly actionsLog: Array<Action> = [];

  public renderLogMessages(): JSX.Element[] {
    return ConnectedComponent.actionsLog.map((item, idx) => <div key={idx}> {JSON.stringify(item)} </div>);
  }

  public render(): JSX.Element {

    const {
      someLabelFromExternalProps, simpleDemoAction, asyncDemoAction, complexDemoAction, demoLoading, demoNumber,
      dataExchangeDemoAction
    } = this.props;

    const paddingStyle = { padding: "10px" };

    return (
      <div style={paddingStyle}>

        <h2> Simple demo [{ someLabelFromExternalProps }]: </h2>

        <div style={paddingStyle}>
          <b>Demo Reducer:</b> <br/> <br/>

          [testLoading]: {demoLoading.toString()} ; <br/>
          [testValue]: {demoNumber.toString()} ; <br/>
        </div>

        <br/>

        <div style={paddingStyle}>
          <button onClick={() => simpleDemoAction(Math.random())}>Send Sync Action</button>
          <button onClick={() => dataExchangeDemoAction(Math.sqrt(Math.random()))}>Send Data Exchange Action</button>
          <button onClick={() => asyncDemoAction(1000 + Math.random() * 1500)}>Send Async Action</button>
          <button onClick={() => complexDemoAction(Math.random() * 10 + 1)}>Send Complex Action</button>
        </div>

        <div>
          <h2>Actions log:</h2>
          {this.renderLogMessages()}
        </div>

      </div>
    );
  }

}

```

## Documentation:

Repository [wiki](https://github.com/Neloreck/redux-cbd/wiki) includes doc and samples. <br/>

## Full examples

Repository includes example project with commentaries: <a href='https://github.com/Neloreck/redux-cbd/tree/master/test/examples'>link</a>. <br/>
My own 'redux-cbd' based project: <a href='https://github.com/Neloreck/x-core'>link</a>. <br/>

## Licence

MIT
