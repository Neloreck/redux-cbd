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

## Quick example:

Global state for combined reducers:

```typescript
export interface IGlobalStoreState {

  demoReducer: DemoReducerState;

}
```

Demo reducer state:

```typescript
export class DemoReducerState {

  public storedNumber: number = 0;
  public loading: boolean = false;

}
```


<br/>
Demo reducer:
<br/> <br/>

```typescript
import {ReflectiveReducer, ActionHandler} from "redux-cbd";

import {AsyncDemoAction, AsyncDemoActionSuccess, SimpleDemoAction} from "../actions";
import {DemoReducerState} from "../state/DemoReducerState";

export class DemoReducer extends ReflectiveReducer<DemoReducerState>  {

  @ActionHandler
  public changeStoredNumber(state: DemoReducerState, action: SimpleDemoAction): DemoReducerState {
    return { ...state, storedNumber: action.payload.storedNumber };
  }

  @ActionHandler
  public startLoadingOnAsyncRequestAction(state: DemoReducerState, action: AsyncDemoAction): DemoReducerState {
    return { ...state, loading: action.payload.loading };
  }

  @ActionHandler
  public finishFakeLoading(state: DemoReducerState, action: AsyncDemoActionSuccess): DemoReducerState {
    return { ...state, storedNumber: action.payload.storedNumber, loading: false };
  }

}
```

<br/>
Actions (considered to be separate files for each one):
<br/> <br/>

```typescript
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

  // Handles 'act' resolved value.
  public afterSuccess(num: number): AsyncDemoActionSuccess {
    return new AsyncDemoActionSuccess(num);
  }

  /*  public afterError(error: Error) { return new .......... } */

}
```
<br/>
Store:
<br/>

```typescript
import {Action, combineReducers, Store, applyMiddleware, createStore, Reducer, Middleware} from "redux";
import {cbdMiddleware, CBDStoreManager} from "redux-cbd";

import {IGlobalStoreState} from "./IGlobalStoreState";

import {DemoReducerState} from "../demo/state/DemoReducerState";
import {DemoReducer} from "../demo/reducer/DemoReducer";

export class ReduxStoreManager extends CBDStoreManager {

  private static STORE_KEY: string = "MY_CUSTOM_STORE_KEY_FOR_CONNECT_DECORATORS_LINKED_WITH_IT";
  private static STORE: Store<IGlobalStoreState, Action<any>>;

  private static createStore(): Store<IGlobalStoreState, Action<any>> {
    const middlewares: Array<Middleware> = [cbdMiddleware];
    return createStore(ReduxStoreManager.createRootReducer(), applyMiddleware(...middlewares));
  }

  private static createRootReducer(): Reducer<IGlobalStoreState> {
    return combineReducers( {
      demoReducer: new DemoReducer().asFunctional(new DemoReducerState(), { freezeState: true }),
    });
  }

  public getStoreKey(): string {
    return ReduxStoreManager.STORE_KEY;
  }

  public getStore(): Store<IGlobalStoreState, Action<any>> {

    if (!ReduxStoreManager.STORE) {
      ReduxStoreManager.STORE = ReduxStoreManager.createStore();
    }

    return ReduxStoreManager.STORE;
  }

}

```

## Documentation:

Repository [wiki](https://github.com/Neloreck/redux-cbd/wiki) includes descriptions and examples. <br/>

## Full examples

Repository includes example project with commentaries: <a href='https://github.com/Neloreck/redux-cbd/tree/master/test/example'>link</a>.

## Licence

MIT
