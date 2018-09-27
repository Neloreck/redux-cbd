# <a href='https://www.npmjs.com/package/redux-cbd'> 🗻 Redux CBD </a>

[![start with wiki](https://img.shields.io/badge/docs-wiki-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/wiki)
[![npm version](https://img.shields.io/npm/v/redux-cbd.svg?style=flat-square)](https://www.npmjs.com/package/redux-cbd)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/blob/master/LICENSE)
<br/>
[![language-ts](https://img.shields.io/badge/language-typescript%3A%2098.9%25-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/search?l=typescript)
[![language-html](https://img.shields.io/badge/language-html%3A%201.1%25-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/search?l=html)
<br/>
[![dependencies Status](https://david-dm.org/neloreck/redux-cbd/status.svg)](https://david-dm.org/neloreck/redux-cbd)
[![devDependencies Status](https://david-dm.org/neloreck/redux-cbd/dev-status.svg)](https://david-dm.org/neloreck/redux-cbd?type=dev)
<br/>
[![Build Status](https://travis-ci.org/Neloreck/redux-cbd.svg?branch=master)](https://travis-ci.org/Neloreck/redux-cbd)
<br/>
[![npm downloads](https://img.shields.io/npm/dm/redux-cbd.svg?style=flat-square)](https://www.npmjs.com/package/redux-cbd)
[![HitCount](http://hits.dwyl.com/neloreck/redux-cbd.svg)](http://hits.dwyl.com/neloreck/redux-cbd)

<hr/>

Typescript decorators\annotations for <a href='https://github.com/reduxjs/redux'> redux</a>. <br/>
Allows you to write class-based declarations of your data storage with strict and predictive typing. <br/>
Enforces some oop mixed with functional style (all key features and implementation of redux remains the same).

Intended to be used with react.
For the ones, who prefer OOP style with strict typings and verbosity with self-documentation.

<hr/>

## Installation

`npm install --save redux-cbd`


<b>Important:</b>
- Package uses <a href='https://github.com/rbuckton/reflect-metadata'>reflect-metadata</a> api, so I'd advice to get acknowledged with its usage and include it in your bundle.
- Package uses expirementalDecorators features (disabled by default for TypeScript).

## Setup
    
    1) Install package.
    2) Inject reflect-metadata into your bundle (webpack entry or import inside your entryfile).
    3) Configure typescript. You should turn on "emitDecoratorMetadata" and "experimentalDecorators" for compiler(*1).
    4) Create some actions (extend simple, complex, async) with @ActionWired annotation.
    5) Create related reducer(extend ReflectiveReducer) with proper @ActionHandlers.
    6) Create rootReducer, that includes reflectiveReducers. Declare storeState interface.
    7) Create store, based on root reducer. Include cbdMiddleware there (*2).
    8) Create @ReduxConnect decorator (optional).
    9) Connect component and use props and actions.
    
    (*1) and (*2) are the most important steps.

tsconfig.json: <br/>
```typescript
{
    "compilerOptions": { 
        ... 
        "emitDecoratorMetadata": true, 
        "experimentalDecorators": true, 
        ... 
    }
}
```
<hr/>


## Example (repo example contains more explanations and structure):

### Entry point:
```typescript jsx
/*
 * This file is entry point instead of 'public static void main(String[] args)'.
 */
 
import {Application} from "./Application";

new Application().render();

```

### Application:
```typescript jsx
import * as React from "react";
import {render} from "react-dom";

// Check doc(wiki) for proper reducers and store creation guide.
import {GlobalStoreProvider, globalStoreManager} from "./data/redux";

// Our simple connected component.
import {ConnectedComponent, IConnectedComponentExternalProps} from "./view/ConnectedComponent";

// @Single
export class Application {

  public render(): void {

    // { ...{} as IConnectedComponentExternalProps } is the trick for correct types handling.
    // Actually, connected component is different from the one we exported with 'export class'.
    // We should use default export with separate props cast or make such mock trick.
    // (I prefer second style with single class declaration and DIRECTLY NAMED imports, which are better).

    // Actual JSX markup for rendering.
    const rootElement: JSX.Element = (
      <GlobalStoreProvider store={globalStoreManager.getStore()}>
        <ConnectedComponent someLabelFromExternalProps={ "Demo prop" } { ...{} as IConnectedComponentExternalProps }/>
      </GlobalStoreProvider>
    );

    // DOM target element.
    const targetElement: HTMLElement | null = document.getElementById("application-root");

    // Render into DOM.
    render(rootElement, targetElement);
  }

}

```

### Store, provider and connect creations:

```typescript jsx
import {Provider} from "react-redux";
import {IReactComponentConnect, linkReactConnectWithStore} from "redux-cbd";

import {GlobalStoreManager} from "./GlobalStoreManager";
import {IGlobalStoreState} from "./IGlobalStoreState";

// Global store state typing, includes reducers for this one (can exist multiple stores in our app).
export {IGlobalStoreState} from  "./IGlobalStoreState";
// Global store manager. Creates store, providers, contains some info about store. Feel free to extend and modify.
export const globalStoreManager: GlobalStoreManager = new GlobalStoreManager();
// Global store provider.
export const GlobalStoreProvider: typeof Provider = globalStoreManager.getProvider();
// @Connect linked to global store, components can be wrapped in multiple connects.
export const withGlobalStoreConnection: IReactComponentConnect<IGlobalStoreState> =
  linkReactConnectWithStore<IGlobalStoreState>(globalStoreManager.getStoreKey());


```


### Global state interface declaration:

```typescript jsx
import {DemoReducerState} from "../demo/state/DemoReducerState";

// Typing related. Interface, that includes ALL of your reducers. Other ones should be included there after creation.
export interface IGlobalStoreState {

  demoReducer: DemoReducerState;

}

```

### Our demo reducer state:

```typescript jsx
// Class over interface for default init. Will transform to simple object after redux processing.
export class DemoReducerState {

  public storedNumber: number = 0;
  public loading: boolean = false;

}

```

### Our demo reducer:

```typescript jsx
import {ActionHandler, ReflectiveReducer} from "redux-cbd";

import {AsyncDemoAction, AsyncDemoActionSuccess, ComplexDemoAction, SimpleDemoAction} from "../actions";
import {DemoReducerState} from "../state/DemoReducerState";

// Reducer class. Typing allows you to create ONLY methods with two params - <genericState, actionType>.
// Looks for method with same action type and executes it. Just like functional reducer with switch but better.
// @ActionHandler is not required. Method name does not influence on behaviour.
// Same action handlers are not allowed inside one class.
export class DemoReducer extends ReflectiveReducer<DemoReducerState>  {

  @ActionHandler
  public changeStoredNumber(state: DemoReducerState, action: SimpleDemoAction): DemoReducerState {
    return { ...state, storedNumber: action.payload.storedNumber };
  }

  @ActionHandler
  public startLoadingOnAsyncActionRequest(state: DemoReducerState, action: AsyncDemoAction): DemoReducerState {
    return { ...state, loading: action.payload.loading };
  }

  @ActionHandler
  public finishFakeLoading(state: DemoReducerState, action: AsyncDemoActionSuccess): DemoReducerState {
    return { ...state, storedNumber: action.payload.storedNumber, loading: false };
  }

}

```

### Our actions for reducer methods (considered to be separate class-files, you know):

```typescript jsx
import {ActionWired, AsyncAction, SimpleAction} from "redux-cbd";

@ActionWired("SIMPLE_ACTION")
export class SimpleDemoAction extends SimpleAction {

  public payload: { storedNumber: number } = { storedNumber: 0 };

  public constructor(num: number) {
    super();

    this.payload.storedNumber = num;
  }

}

@ActionWired("ASYNC_ACTION_SUCCESS")
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
```

### Global store manager:
```typescript jsx
import {Action, combineReducers, Store, applyMiddleware, createStore, Middleware, Reducer} from "redux";
import {CBDStoreManager, cbdMiddleware} from "redux-cbd";

// Whole store bundle interface.
import {IGlobalStoreState} from "./IGlobalStoreState";

// Demo reducer class and its state.
import {DemoReducerState} from "../demo/state/DemoReducerState";
import {DemoReducer} from "../demo/reducer/DemoReducer";

export class GlobalStoreManager extends CBDStoreManager {

  private static STORE_KEY: string = "GLOBAL_STORE";
  private static store: Store<IGlobalStoreState, Action<any>>;

  // Creating store. Singleton instance for whole app. Also, we can use @Single decorator there. (if we will iml it)
  private createStore(): Store<IGlobalStoreState, Action<any>> {
    const middlewares: Array<Middleware> = [cbdMiddleware];
    return createStore(this.createRootReducer(), applyMiddleware(...middlewares));
  }

  // Creating root reducer, based on our application global state.
  // Recommend to create model/module related ones instead of page-related. For example: auth, userSetting etc.
  private createRootReducer(): Reducer<IGlobalStoreState> {
    // new DemoReducer().asFunctional(new DemoReducerState(), { freezeState: true })
    // is same to
    // createReflectiveReducer(DemoReducer, new DemoReducerState(), { freezeState: true })
    //
    // reducers created in a default way are supposed to work as intended

    return combineReducers( {
      demoReducer: new DemoReducer().asFunctional(new DemoReducerState(), { freezeState: true })
    });
  }

  // Unique store key for provider, default is 'store'.
  public getStoreKey(): string {
    return GlobalStoreManager.STORE_KEY;
  }

  // Singleton store getter.
  public getStore(): Store<IGlobalStoreState, Action<any>> {

    if (!GlobalStoreManager.store) {
      GlobalStoreManager.store = this.createStore();
    }

    return GlobalStoreManager.store;
  }

}

```

### Connected component

```typescript jsx
import * as React from "react";
import {PureComponent} from "react";
import {Action} from "redux";

// Store related things.
import {withGlobalStoreConnection, IGlobalStoreState} from "../data/redux";
import {AsyncDemoAction, SimpleDemoAction, ComplexDemoAction} from "../data/demo/actions";

/*
 * Connected component example.
 */

// Props, that are injected from connected store (from single decorator).
interface IConnectedComponentStoreProps {
  demoLoading: boolean;
  demoNumber: number;
}

// Props, mapped and injected as actions creators (from single decorator).
interface IConnectedComponentDispatchProps {
  simpleDemoAction: (num: number) => any;
  asyncDemoAction: (num: number) => any;
  complexDemoAction: (num: number) => any;
}

// External props, that are injected by different decorators.
// For example: @Connect, @withStyles (material ui), @withWrapper (provide some props with HOC by decorator usage) etc.
export interface IConnectedComponentExternalProps extends IConnectedComponentStoreProps,
  IConnectedComponentDispatchProps {}

// Own props, that are passed with manual component/container creation.
// Router-managed components are not so complicated because we don't create them manually.
export interface IConnectedComponentOwnProps {
  someLabelFromExternalProps: string;
}
  
// General props for whole component for overall picture, everything can be accessed from the inside.
export interface IConnectedComponentProps extends IConnectedComponentOwnProps, IConnectedComponentExternalProps {}

// Link global store provider with component. This props will be injected automatically and should be type safe.
@withGlobalStoreConnection<IConnectedComponentStoreProps, IConnectedComponentDispatchProps, IConnectedComponentProps>(
  // State is strict-typed there. Props are injected directly from state. We can use selectors there.
  // Also, we can add some types of simple selectors into this lib (PRs and ideas are welcome, just follow the style).
  (store: IGlobalStoreState) => {
    return {
      demoLoading: store.demoReducer.loading,
      demoNumber: store.demoReducer.storedNumber
    };
  }, {
    // Returned values will be dispatched. Mapping params to actions creation and store dispatch.
    simpleDemoAction: (num: number) => new SimpleDemoAction(num),
    complexDemoAction: (num: number) => new ComplexDemoAction(num),
    asyncDemoAction: (num: number) => new AsyncDemoAction(num)
  })
// Stateless component, but second template param can be supplied for stateful ones. Third type is context.
export class ConnectedComponent extends PureComponent<IConnectedComponentProps> {

  public render(): JSX.Element {

    const {
      someLabelFromExternalProps, simpleDemoAction, asyncDemoAction, complexDemoAction, demoLoading, demoNumber
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
          <button onClick={() => asyncDemoAction(1000 + Math.random() * 1500)}>Send Async Action</button>
          <button onClick={() => complexDemoAction(Math.random() * 10 + 1)}>Send Complex Action</button>
        </div>

      </div>
    );
  }

}

```

## Documentation:

Repository [wiki](https://github.com/Neloreck/redux-cbd/wiki) includes descriptions and examples. <br/>

## Full examples

Repository includes example project with commentaries: <a href='https://github.com/Neloreck/redux-cbd/tree/master/test/example'>link</a>.

## Licence

MIT
