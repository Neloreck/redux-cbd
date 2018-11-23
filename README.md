# <a href='https://github.com/Neloreck/redux-cbd'> 🗻 @redux-cbd </a>

[![start with wiki](https://img.shields.io/badge/docs-wiki-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/wiki)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/blob/master/LICENSE)
<br/>
[![npm downloads](https://img.shields.io/npm/dt/redux-cbd.svg?style=flat-square)](https://www.npmjs.com/package/redux-cbd) 
[![npm downloads](https://img.shields.io/npm/dt/@redux-cbd/core.svg?style=flat-square)](https://www.npmjs.com/package/@redux-cbd/core)
[![npm downloads](https://img.shields.io/npm/dt/@redux-cbd/context.svg?style=flat-square)](https://www.npmjs.com/package/@redux-cbd/context)
[![npm downloads](https://img.shields.io/npm/dt/@redux-cbd/utils.svg?style=flat-square)](https://www.npmjs.com/package/@redux-cbd/utils) <br/>
[![HitCount](http://hits.dwyl.com/neloreck/redux-cbd.svg)](http://hits.dwyl.com/neloreck/redux-cbd)
[![HitCount](http://hits.dwyl.com/neloreck/@redux-cbd/core.svg)](http://hits.dwyl.com/neloreck/@redux-cbd/core)
[![HitCount](http://hits.dwyl.com/neloreck/@redux-cbd/context.svg)](http://hits.dwyl.com/neloreck/@redux-cbd/context)
[![HitCount](http://hits.dwyl.com/neloreck/@redux-cbd/utils.svg)](http://hits.dwyl.com/neloreck/@redux-cbd/utils)

<hr/>

Typescript decorators\annotations, utils and abstract classes for <a href='https://github.com/facebook/react'>react</a>-<a href='https://github.com/reduxjs/redux'>redux</a> or contextAPI application. <br/>
Adds various utility annotations such as @Single, @EntryPoint, @Connect or @Wrapped (utils package). <br/>
Allows you to write class-based declarations of your data storage with strict and predictive typing. <br/>
Enforces typesafety and OOP mixed with functional style (all key features and implementation of redux remains the same). <br/>

Intended to be used with react-redux or with native react context API.

<hr/>

## NPM packages

<a href='https://www.npmjs.com/package/redux-cbd'> redux-cbd </a> - old bundled library package.  <br/>
<a href='https://www.npmjs.com/package/@redux-cbd/core'> @redux-cbd/core </a> - current library redux core package. <br/>
<a href='https://www.npmjs.com/package/@redux-cbd/context'> @redux-cbd/context </a> - current library context core package. <br/>
<a href='https://www.npmjs.com/package/@redux-cbd/utils'> @redux-cbd/utils </a> - current library utils package (optional). <br/>

## Installation

For older stable version:
- `npm install --save redux-cbd` (includes older core and utils)

For current ongoing packages with redux:
- `npm install --save @redux-cbd/core`
- `npm install --save @redux-cbd/utils` (optional)

For current ongoing packages with context:
- `npm install --save @redux-cbd/context`
- `npm install --save @redux-cbd/utils` (optional)

<b>Important:</b>
- Core package uses proposal ES <a href='https://github.com/rbuckton/reflect-metadata'>reflect-metadata</a> api, so I would advice to get acknowledged with its usage.
- Package uses 'expirementalDecorators' features (disabled by default for TypeScript transpiler).
- You can use both approaches in one app. Redux for global store, context for smaller package-level component bundles etc.

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

## Alternative approach

You can use react context instead of redux and immutable actions\reducers approach. <br/>
In this case you will not need reflect-metadata-api and numberous declarations, but it be harder for debugging or state sync. <br/>
Experimental decorators are still needed for context lib. <br/>

Also, you can mix both approaches, if small reactive storage outside of reducers is needed for small module/components lib.

## What is inside

| [Annotations](https://github.com/Neloreck/redux-cbd/wiki/Annotations) | [Actions](https://github.com/Neloreck/redux-cbd/wiki/Actions) | [Reducers](https://github.com/Neloreck/redux-cbd/wiki/Reducers) | [Middleware](https://github.com/Neloreck/redux-cbd/wiki/Middleware) | [Utils](https://github.com/Neloreck/redux-cbd/wiki/Utils)|
| :------------- | :------------- | :------------- | :------------- | :------------- |
| [@Single](https://github.com/Neloreck/redux-cbd/wiki/@Single) | [SimpleAction](https://github.com/Neloreck/redux-cbd/wiki/SimpleAction) | [ReflectiveReducer](https://github.com/Neloreck/redux-cbd/wiki/ReflectiveReducer) | [cbdMiddleware](https://github.com/Neloreck/redux-cbd/wiki/cbdMiddleware) | [createReflectiveReducer](https://github.com/Neloreck/redux-cbd/wiki/createReflectiveReducer) |
| [@EntryPoint](https://github.com/Neloreck/redux-cbd/wiki/@EntryPoint) | [DataExchangeAction](https://github.com/Neloreck/redux-cbd/wiki/DataExchangeAction) | [IReducerConfig](https://github.com/Neloreck/redux-cbd/wiki/IReducerConfig) | - | [linkReactConnectWithStore](https://github.com/Neloreck/redux-cbd/wiki/linkReactConnectWithStore) |
| [@Bind](https://github.com/Neloreck/redux-cbd/wiki/@Bind) | [ComplexAction](https://github.com/Neloreck/redux-cbd/wiki/ComplexAction) | [CBDStoreManager](https://github.com/Neloreck/redux-cbd/wiki/CBDStoreManager) | - | [LazyComponentFactory](https://github.com/Neloreck/redux-cbd/wiki/LazyComponentFactory) |
| [@Wrapped](https://github.com/Neloreck/redux-cbd/wiki/@Wrapped) | [AsyncAction](https://github.com/Neloreck/redux-cbd/wiki/AsyncAction) | - | - | [getActionType](https://github.com/Neloreck/redux-cbd/wiki/getActionType) |
| [@StoreManaged](https://github.com/Neloreck/redux-cbd/wiki/@StoreManaged) | [FunctionalAction](https://github.com/Neloreck/redux-cbd/wiki/FunctionalAction)  | - | - | [payloadValue](https://github.com/Neloreck/redux-cbd/wiki/payloadValue)  |
| [@ActionWired](https://github.com/Neloreck/redux-cbd/wiki/@ActionWired) | - | - | - | [ReactContextManager](https://github.com/Neloreck/redux-cbd/wiki/ReactContextManager) |
| [@ActionHandler](https://github.com/Neloreck/redux-cbd/wiki/@StoreManaged) | - | - | - | - |
| [@Provide](https://github.com/Neloreck/redux-cbd/wiki/@Provide) | - | - | - | - |
| [@Consume](https://github.com/Neloreck/redux-cbd/wiki/@Consume) | - | - | - | - |

## Example (wiki contains more explanations):

### Redux (@redux-cbd/core approach): 

<details><summary>Application entrypoint.</summary>
<p>
    
```typescript jsx
import * as React from "react";
import {render} from "react-dom";
import {EntryPoint} from "@redux-cbd/utils";

import {GlobalStoreProvider} from "./data/redux";
import {ConnectedComponent, IConnectedComponentExternalProps} from "./view/ConnectedComponent";

@EntryPoint()
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

</p>
</details>

<details><summary>Store, provider and connect creations.</summary>
<p>
    
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

</p>
</details>

<details><summary>State declarations.</summary>
<p>
    
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

</p>
</details>

<details><summary>Demo reducer.</summary>
<p>
  
```typescript jsx
import {ActionHandler, ReflectiveReducer} from "@redux-cbd/core";

import {AsyncDemoAction, AsyncDemoActionSuccess, ComplexDemoAction, SimpleDemoAction, DataExchangeDemoAction} from "../actions";
import {DemoReducerState} from "../state/DemoReducerState";

// Reducer class. Typing allows you to create ONLY methods with two params - <genericState, actionType>.
// Looks for method with same action type and executes it. Just like functional reducer with switch but better.
// @ActionHandler is not required. Method name does not influence on behaviour.
// Same action handlers are not allowed inside one class.
export class DemoReducer extends ReflectiveReducer<DemoReducerState>  {

    @ActionHandler()
    public changeStoredNumber(state: DemoState, action: SimpleDemoAction): DemoState {
      return { ...state, storedNumber: action.payload.storedNumber };
    }
  
    @ActionHandler()
    public exchangeSomeData(state: DemoState, action: DataExchangeDemoAction): DemoState {
      return { ...state, storedNumber: action.payload.storedNumber };
    }
  
    @ActionHandler()
    public startLoadingOnAsyncActionReceived(state: DemoState, action: AsyncDemoAction): DemoState {
      return { ...state, loading: action.payload.loading };
    }
  
    @ActionHandler()
    public finishFakeLoading(state: DemoState, action: AsyncDemoActionSuccess): DemoState {
      return { ...state, storedNumber: action.payload.storedNumber, loading: false };
    }
  
    @ActionHandler()
    public handleComplexAction(state: DemoState, action: ComplexDemoAction): DemoState {
      return { ...state, storedNumber: action.payload.storedNumber };
    }

}

```

</p>
</details>

<details><summary>Actions for reducer methods (considered to be separate class-files, you know).</summary>
<p>
    

```typescript jsx
import {ActionWired, AsyncAction, SimpleAction, DataExchangeAction} from "@redux-cbd/core";

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
export class AsyncDemoAction<DemoState> extends AsyncAction {

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
export class ComplexDemoAction<DemoState> extends ComplexAction {

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

</p>
</details>

<details><summary>Global store manager.</summary>
<p>
    
```typescript jsx
import {Action, combineReducers, Store, applyMiddleware, createStore, Middleware, Reducer} from "redux";
import {StoreManaged, CBDStoreManager, cbdMiddleware} from "@redux-cbd/core";

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
  protected createStore(): Store<IGlobalStoreState, AnyAction> {
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

</p>
</details>

<details><summary>Connected component.</summary>
<p>
  
```typescript jsx
import * as React from "react";
import {PureComponent} from "react";
import {Action} from "redux";
import {Bind} from "@redux-cbd/utils";

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
  sendSimpleDemoAction: (num: number) => SimpleDemoAction;
  sendAsyncDemoAction: (num: number) => AsyncDemoAction;
  sendComplexDemoAction: (num: number) => ComplexDemoAction;
  sendDataExchangeDemoAction: (num: number) => DataExchangeDemoAction;
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

// Link global store provider with component. This props will be injected automatically and should be type safe.
@GlobalStoreConnect<IConnectedComponentStoreProps, IConnectedComponentDispatchProps, IConnectedComponentOwnProps>(
  (store: IGlobalStoreState) => {
    return {
      demoLoading: store.demoReducer.loading,
      demoNumber: store.demoReducer.storedNumber
    };
  }, {
    sendSimpleDemoAction: (num: number) => new SimpleDemoAction(num),
    sendComplexDemoAction: (num: number) => new ComplexDemoAction(num),
    sendAsyncDemoAction: (num: number) => new AsyncDemoAction(num),
    sendDataExchangeDemoAction: (num) => new DataExchangeDemoAction({ storedNumber: num })
  })
export class ConnectedComponent extends PureComponent<IConnectedComponentOwnProps & IConnectedComponentExternalProps> {

  public static actionsLog: Array<Action> = [];

  public renderLogMessages(): JSX.Element[] {
    return ConnectedComponent.actionsLog.map((item, idx) => <div key={idx}> {JSON.stringify(item)} </div>);
  }

  public render(): JSX.Element {

    const {someLabelFromExternalProps, demoLoading, demoNumber} = this.props;
    const paddingStyle = { padding: "10px" };

    return (
      <div style={paddingStyle}>

        <div> Also, check console. External prop: [{ someLabelFromExternalProps }]: </div>

        <div style={paddingStyle}>
          <b>Demo Reducer:</b> <br/> <br/>
          [testLoading]: {demoLoading.toString()} ; <br/>
          [testValue]: {demoNumber.toString()} ; <br/>
        </div>

        <br/>

        <div style={paddingStyle}>
          <button onClick={this.sendSimpleDemoAction}>Send Sync Action</button>
          <button onClick={this.sendDataExchangeAction}>Send Data Exchange Action</button>
          <button onClick={this.sendAsyncAction}>Send Async Action</button>
          <button onClick={this.sendComplexAction}>Send Complex Action</button>
          <button onClick={this.clearLogMessages}>Clean</button>
        </div>

        <div>
          <div>Actions log:</div>
          {this.renderLogMessages()}
        </div>

      </div>
    );
  }

  @Bind()
  private clearLogMessages(): void {
    ConnectedComponent.actionsLog = [];
    this.forceUpdate();
  }

  @Bind()
  private sendSimpleDemoAction(): void {
    this.props.sendSimpleDemoAction(Math.random() * 999 + 1);
  }

  @Bind()
  private sendDataExchangeAction(): void {
    this.props.sendDataExchangeDemoAction(Math.random() * 9999 + 1000)
  }

  @Bind()
  private sendComplexAction(): void {
    this.props.sendComplexDemoAction(Math.random() * -9999 - 1)
  }

  @Bind()
  private sendAsyncAction(): void {
    this.props.sendComplexDemoAction(Math.random() * -99999 - 10000)
  }

}
```

</p>
</details>

<details><summary>Example build config.</summary>
<p>
    
```typescript jsx
import * as webpack from "webpack";
import * as path from "path";

const HtmlWebpackPlugin =  require("html-webpack-plugin");

const mode = process.env.NODE_ENV;
const projectRoot = path.resolve(__dirname, "./");

// For development purposes only.
// Extend and rewrite it properly with webpack documentation.
// Use proper config for production builds.
export class WebpackConfig implements webpack.Configuration {

  mode: "development" = "development";

  resolve = {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  };

  entry = [
    path.resolve(projectRoot, "src/Application.tsx")
  ];

  output = {
    path: path.resolve(projectRoot, "target/"),
    filename: "js/[name].bundle.js",
    sourceMapFilename: "js/map/[name].bundle.map"
  };

  devtool: "source-map" = "source-map";

  // Add the loader for .ts files.
  module = {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "awesome-typescript-loader",
        query: {
          configFileName: path.resolve(projectRoot, "./tsconfig.json")
        }
      }
    ]
  };

  plugins = [
    new HtmlWebpackPlugin({
      inject: true,
      filename: "index.html",
      template: path.resolve(projectRoot, "src/index.html")
    })
  ];

  devServer = {
    contentBase: "target/",
    historyApiFallback: true,
    compress: true,
    port: 3000,
    host: "0.0.0.0"
  }

}

export default new WebpackConfig();
```

</p>
</details>

### Context (@redux-cbd/context approach): 

<details><summary>Application entrypoint.</summary>
<p>
    
```typescript jsx
import * as React from "react";
import {render} from "react-dom";

import {EntryPoint} from "@redux-cbd/utils";
import {MainView, IMainViewExternalProps} from "./view/MainView";

@EntryPoint()
export class Application {

  /*
   * { ...{} as IConnectedComponentExternalProps } is the trick for correct types handling.
   * Actually, connected component is different from the one we exported with 'export class'.
   * We should use default export with separate props cast or make such mock trick.
   * (I prefer second style with single class declaration and DIRECTLY NAMED imports, which are better).
   */
  public static main(): void {
    render(<div>
      <MainView someLabelFromExternalProps={ "First component." } { ...{} as IMainViewExternalProps }/>
      <MainView someLabelFromExternalProps={ "Second component." } { ...{} as IMainViewExternalProps }/>
    </div>, document.getElementById("application-root"));
  }

}
```

</p>
</details>

<details><summary>Context store reexport and signleton creation.</summary>
<p>
    
```typescript jsx
import {AuthContextManager, IAuthContext} from "./AuthContextManager";

export const authContextManager: AuthContextManager = new AuthContextManager();
export {AuthContextManager, IAuthContext} from "./AuthContextManager";

```

</p>
</details>

<details><summary>Context and handlers declaration.</summary>
<p>
    
```typescript jsx
import {Bind} from "@redux-cbd/utils";
import {ReactContextManager} from "@redux-cbd/context";

export interface IAuthContext {
  authActions: {
    setUser: (user: string) => void;
    setUserAsync: () => Promise<void>;
    changeAuthenticationStatus: () => void;
  };
  authState: {
    isAuthenticated: boolean;
    user: string;
  };
}

export class AuthContextManager extends ReactContextManager<IAuthContext> {

  protected readonly context: IAuthContext = {
    authActions: {
      changeAuthenticationStatus: this.changeAuthenticationStatus,
      setUserAsync: this.setUserAsync,
      setUser: this.setUser
    },
    authState: {
      isAuthenticated: true,
      user: "anonymous"
    }
  };
  
  /*
   * Bind is used for methods binding.
   * Arrow functions or method.bind(this) are also viable there.
   *
   * Also, do not forget to copy state objects as new ones for proper updates. 
   * 'this.update()' is used for re-rendering, you can delay or force it manually.
   */

  @Bind()
  public changeAuthenticationStatus(): void {
    this.context.authState = { ...this.context.authState, isAuthenticated: !this.context.authState.isAuthenticated };
    this.update();
  }

  @Bind()
  public setUser(user: string): void {
    this.context.authState = { ...this.context.authState, user };
    this.update();
  }

  @Bind()
  public setUserAsync(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.context.authState = {...this.context.authState, user: "user-" + Math.floor(Math.random() * 10000)};
        this.update();
        resolve();
      }, 3000)
    });
  }

}
```

</p>
</details>

<details><summary>Connected component.</summary>
<p>
  
```typescript jsx
import * as React from "react";
import {PureComponent} from "react";
import {Consume, Provide} from "@redux-cbd/context";

// Store related things.

import {authContextManager, IAuthContext} from "../data";

// Props typing.

export interface IMainViewOwnProps { someLabelFromExternalProps: string; }

export interface IMainViewExternalProps extends IAuthContext {}

export interface IMainViewProps extends IMainViewExternalProps, IMainViewOwnProps {}

// Component related.

/*
 * Better place for provider is some kind of general component or router etc.
 *
 * Provide auth context for all consumers, then consume it. 
 * Consume provider props and inject into component state there.
 */

@Provide(authContextManager)
@Consume<IAuthContext, IMainViewProps>(authContextManager)
export class MainView extends PureComponent<IMainViewProps> {

  public render(): JSX.Element {
    const {
      someLabelFromExternalProps,
      authState: {user, isAuthenticated},
      authActions: {setUser, setUserAsync, changeAuthenticationStatus}
    } = this.props;

    const paddingStyle = { padding: "10px" };

    return (
      <div style={paddingStyle}>

        <div> External prop value: '{ someLabelFromExternalProps }' </div>

        <div style={paddingStyle}>
          <span>USERNAME: </span> {user} <br/>
          <span>AUTHENTICATED: </span>  {isAuthenticated.toString()} <br/>
        </div>

        <div style={paddingStyle}>
          <button onClick={changeAuthenticationStatus}>Change Authentication Status</button>
          <button onClick={setUserAsync}>Randomize User Async</button>
          <button onClick={() => setUser("user-" + Math.floor(Math.random() * 100))}>Randomize User</button>
        </div>

      </div>
    );
  }

}
```

</p>
</details>

<details><summary>Example build config.</summary>
<p>
    
```typescript jsx
import * as webpack from "webpack";
import * as path from "path";

const HtmlWebpackPlugin =  require("html-webpack-plugin");

const mode = process.env.NODE_ENV;
const projectRoot = path.resolve(__dirname, "./");

// For development purposes only.
// Extend and rewrite it properly with webpack documentation.
// Use proper config for production builds.
export class WebpackConfig implements webpack.Configuration {

  mode: "development" = "development";

  resolve = {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  };

  entry = [
    path.resolve(projectRoot, "src/Application.tsx")
  ];

  output = {
    path: path.resolve(projectRoot, "target/"),
    filename: "js/[name].bundle.js",
    sourceMapFilename: "js/map/[name].bundle.map"
  };

  devtool: "source-map" = "source-map";

  // Add the loader for .ts files.
  module = {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "awesome-typescript-loader",
        query: {
          configFileName: path.resolve(projectRoot, "./tsconfig.json")
        }
      }
    ]
  };

  plugins = [
    new HtmlWebpackPlugin({
      inject: true,
      filename: "index.html",
      template: path.resolve(projectRoot, "src/index.html")
    })
  ];

  devServer = {
    contentBase: "target/",
    historyApiFallback: true,
    compress: true,
    port: 3000,
    host: "0.0.0.0"
  }

}

export default new WebpackConfig();
```

</p>
</details>

## Documentation:

Repository [wiki](https://github.com/Neloreck/redux-cbd/wiki) includes doc and samples. <br/>

## Proposals and contribution:

Feel free to contibute or mail me with questions/proposals/issues (Neloreck@gmail.com). <br/>

## Full examples

Repository includes example project with commentaries: <a href='https://github.com/Neloreck/redux-cbd/tree/master/examples'>link</a>. <br/>
My own 'redux-cbd' based project: <a href='https://github.com/Neloreck/x-core'>link</a>. <br/>
Library unit tests also include some different examples of cbd usage.

## Licence

MIT
