# <a href='https://www.npmjs.com/package/redux-cbd'> 🗻 Redux CBD </a>

<hr/>

Typescript decorators\annotations for <a href='https://github.com/reduxjs/redux'> redux</a>. <br/>
Allows you to write more declarative code related to your data storage with strict and predictive typing. 

Intended to be used with react, but can be mixed with any framework supporting typescript.

<hr/>

## Installation

```
npm install --save redux-cbd
```

<b>Important:</b>
- Package uses <a href='https://github.com/rbuckton/reflect-metadata'>reflect-metadata</a> api, so I'd advice to get acknowledged with its usage.
- Package uses expirementalDecorators features.

## Setup
    
    1) Install package.
    2) Configure typescript. You should turn on "emitDecoratorMetadata" and "experimentalDecorators" for compiler(*1).
    3) Create some actions (extend simple, complex, async) with @ActionWired annotation.
    4) Create related reducer(extend ReflectiveReducer) with proper @ActionHandlers.
    5) Create rootReducer, that includes reflectiveReducers. Declare storeState interface.
    6) Create store, based on root reducer. Include cbdMiddleware there (*2).
    6) Create @ReduxConnect decorator (optional).
    7) Connect component and use props and actions.
    
    (*1) and (*2) are the most important steps.

tsconfig.json: <br/>

    {
        "compilerOptions": { 
            ... 
            "emitDecoratorMetadata": true, 
            "experimentalDecorators": true, 
            ... 
        }
    }

<hr/>

## Quick example:

State:

```
export class DemoReducerState {

  public storedNumber: number = 0;
  public loading: boolean = false;

}
```

<br/>
Reducer:

```
import {ReflectiveReducer, ActionHandler} from "redux-cbd";

import {AsyncDemoAction, AsyncDemoActionSuccess, SimpleDemoAction} from "../actions";
import {DemoReducerState} from "../state/DemoReducerState";

export class DemoReducer extends ReflectiveReducer<DemoReducerState>  {

  @ActionHandler
  public changeStoredNumber(state: DemoReducerState, action: SimpleDemoAction): DemoReducerState {
    return { ...state, storedNumber: action.payload.storedNumber };
  }

  @ActionHandler
  public startLoadingAfterAsyncAction(state: DemoReducerState, action: AsyncDemoAction): DemoReducerState {
    return { ...state, loading: action.payload.loading };
  }

  @ActionHandler
  public finishFakeLoading(state: DemoReducerState, action: AsyncDemoActionSuccess): DemoReducerState {
    return { ...state, storedNumber: action.payload.storedNumber, loading: false };
  }

}
```

<br/>
Actions:

```
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
<br/>

## Documentation:

Repository [wiki](https://github.com/Neloreck/redux-cbd/wiki) includes descriptions and examples. <br/>

## Full examples

Repository includes example project with commentaries: <a href='https://github.com/Neloreck/redux-cbd/tree/master/test/example'>link</a>.

## Licence

MIT
