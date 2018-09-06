# <a href='http://redux.js.org'> 🗻 Redux CBD </a>

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

tsconfig.json:
{
  "compilerOptions": {
    ...
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    ...
}

<hr/>

## Fast example:

State:

```

export class DemoReducerState {

  public storedNumber: number = 0;
  public loading: boolean = false;

}

```

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

## Documentation:

### Annotation:

  - <b> @ActionHandler </b>

    Method annotation. <br/>
    Currently does not have any influnce on workflow. Will be involved into later releases. <br/>
    Useful for visual acknowledgement of action handler methods.

    Example:

    ```
    ...
    
    @ActionHandler
    public handleComplexAction(state: DemoReducerState, action: ComplexDemoAction): DemoReducerState {
      return { ...state, storedNumber: action.payload.storedNumber };
    }
    
    ...

    ```
  
  - <b> @ActionWired(actionType: string) </b>

    Injects action type into each instance. <br/>
    You should not create type property manually or handle it anywhere else. <br/>

    Example: 

    ```
    import {ActionWired, SimpleAction} from "redux-cbd";

    @ActionWired("SIMPLE_TEST_ACTION")
    export class SimpleDemoAction extends SimpleAction {

      public payload: { storedNumber: number } = { storedNumber: 0 };

    }

    ```

### Action:

  - <b> SimpleAction </b>
    
    Action type. <br/>
    Dispatches self immediately. <br/>
    Maps type from @ActionWired and payload from nested payload prop.  <br/>
  
    Example:
    
    ```
    import {ActionWired, SimpleAction} from "redux-cbd";
      
    @ActionWired("SIMPLE_TEST_ACTION")
    export class SimpleDemoAction extends SimpleAction {

      public payload: { storedNumber: number } = { storedNumber: 0 };

      public constructor(num: number) {
        super();

        this.payload.storedNumber = num;
      } 

    }

    ```
  
  - <b> ComplexAction </b>
  
    Action type. Extends SimpleAction.  <br/>
    Dispatches self after sync 'act' method execution. <br/>
    Maps type from @ActionWired and payload from nested payload prop. <br/>
    
    Should implement sync 'act' method. <br/>
    
     Example:

      ```
      
      import {ActionWired, ComplexAction} from "redux-cbd";

      @ActionWired("COMPLEX_DEMO_ACTION")
      export class ComplexDemoAction extends ComplexAction {

        public payload: { storedNumber: number } = { storedNumber: 0 };

        public constructor(num: number) {
          super();

          this.payload.storedNumber = num;
        }

        public act(): void {
          // Some random computions.
          this.payload.storedNumber *= 1000 + 500 * Math.random();
        }

      }

    
    ```
    
  - <b> AsyncAction </b>
    
    Action type. Extends SimpleAction. <br/>
    Dispatches self before async 'act' method execution. <br/>
    Maps type from @ActionWired and payload from nested payload prop. <br/>
    
    Should implement async 'act' method. <br/>
    Should implement 'afterSuccess' method, that executes after main 'act' part. <br/>
    Async error throws exception. Also, you can implement 'afterError' method for error handling.
  
    Example:

    ```
      import {ActionWired, AsyncAction} from "redux-cbd";
      import {AsyncDemoActionSuccess} from "./AsyncDemoActionSuccess";

      @ActionWired("ASYNC_TEST_ACTION")
      export class AsyncDemoAction extends AsyncAction {

        public readonly payload: { loading: boolean } = { loading: true };
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

### Middleware:

  - <b> cbdMiddleware </b>

    Middleware. <br/>
    Maps class instances as raw objects with type and payload. <br/>
    <br/>
    Resulting type: <br/>
    { type: string, payload: object }). <br/>
    <br/>
    Executes async actions (AsyncAction, ComplexAction). <br/>

    Example:

    ```
    import {cbdMiddleware} from "redux-cbd";

    ...
    const store: IStoreState = createStore(createRootReducer(), applyMiddleware(...[cbdMiddleware]));
    ...

    ```
  
### Reducer:

  - <b> IReducerConfig </b>

    Reducer creation settings. <br/>
    Used for 'createReflectiveReducer' and 'asFunctional'. <br/>

     { <br/>
        freezeState: boolean <br/>
     } <br/>

     <b>FreezeState</b>: freeze state objects, prevent mutations from reducer methods.

  - <b> ReflectiveReducer<T> </b>

    Reducer type. <br/>
    Each class-based reducer should extend it. Has strict typing. <br/>

    Mehods should have such signature or typescript will throw error: <br/>
    <u>(state: T, action: T2 extends SimpleAction) => T;</u> <br/>

    Reflection metadata maps methods as handlers for second param type. <br/>
    Each reducer can contain only one same action type handler. <br/>

    Instance will have method 'asFunctional(defaultState: object, settings: object)'. <br/>

    Example:

    ```
    import {ReflectiveReducer, ActionHandler} from "redux-cbd";

    export class DemoReducer extends ReflectiveReducer<DemoReducerState>  {

      @ActionHandler
      public changeStoredNumber(state: DemoReducerState, action: SimpleDemoAction): DemoReducerState {
        return { ...state, storedNumber: action.payload.storedNumber };
      }

    }

    ```

### Util:

  - <b> createReflectiveReducer<T extends ReflectiveReducer>(ReducerClass: T, defaultState: Object, config: Object) </b>

    Creates reflective reducer from class, that extends ReflectiveReducer.
    Root reducer should be created by default way, only ReflectiveReducers should be instantiated like this.

    Example: 

    ```
    import {createReflectiveReducer} from "redux-cbd";

    ...
    const rootReducer = combineReducers({
        someReducer: createReflectiveReducer(DemoReducer, new DemoReducerState(), { freezeState: true }),
        // Same result:
        anotherReducer: new DemoReducer().asFunctional(new DemoReducerState(), { freezeState: true })
    });
    ...

    ```

  - <b> linkReactConnectWithStore<T>: () => ConnectDecorator<T> </b>

    Creates connect decorator that allows you to use it instead of higher order functions (mapDispatch, mapState).
    Respects named export and store typing.

    Example: 

    ```
    import {linkReactConnectWithStore} from "redux-cbd";
    import {IReduxStoreState} from "./IReduxStoreState";

     export const ReduxConnect = linkReactConnectWithStore<IReduxStoreState>();

    ```
    Usage example:

    ```
    import {ReduxConnect} from "./ReduxConnect";

    // Map state from store.
    interface IConnectedComponentStoreProps {
      temp: number;
    }

    // Map actions with dispatch.
    interface IConnectedComponentDispatchProps {
      someAction: (num: number) => any;
    }

    // Composite prop interface, can iclude external ones.
    export interface IConnectedComponentProps extends IConnectedComponentStoreProps, IConnectedComponentDispatchProps {
    }

    @ReduxConnect<IConnectedComponentStoreProps, IConnectedComponentDispatchProps, IConnectedComponentProps>(
      (store: IReduxStoreState) => {
        return {
          temp: store.demoReducer.temp,
        };
      }, {
        someAction: (num: number) => new CustomClassBasedAction(num)
      })
    export class ConnectedComponent extends Component<IConnectedComponentProps> {

      public render(): JSX.Element {
        const {temp, someAction} = this.props;
        return <div onClick={() => someAction()}>Example:{temp};<div>;
      }

    }

    ```

## Full examples

Repository includes example project with commentaries: <a href='https://github.com/Neloreck/redux-cbd/tree/master/test/example'>link</a>.

## Licence

MIT