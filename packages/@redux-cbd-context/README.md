# <a href='https://www.npmjs.com/package/@redux-cbd/context'> 🗻 @redux-cbd/context </a>

[![npm version](https://img.shields.io/npm/v/@redux-cbd/utils.svg?style=flat-square)](https://www.npmjs.com/package/@redux-cbd/context)
[![language-ts](https://img.shields.io/badge/language-typescript%3A%2099%25-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/search?l=typescript)<br/>
[![start with wiki](https://img.shields.io/badge/docs-wiki-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/wiki)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/Neloreck/redux-cbd/blob/master/LICENSE)
<br/>
[![npm downloads](https://img.shields.io/npm/dt/@redux-cbd/context.svg?style=flat-square)](https://www.npmjs.com/package/@redux-cbd/context)
[![HitCount](http://hits.dwyl.com/neloreck/@redux-cbd/context.svg)](http://hits.dwyl.com/neloreck/@redux-cbd/context)

<hr/>

@redux/cbd context package that allow you to write much shorter reactive storages instead of redux.

<hr/>

## Installation


For current ongoing package:
- `npm install --save @redux-cbd/context`


<b>Important:</b>
- Package uses 'expirementalDecorators' features (disabled by default for TypeScript transpiler).

<hr/>

## What is inside

| @[Annotations](https://github.com/Neloreck/redux-cbd/wiki/Annotations)| [Utils](https://github.com/Neloreck/redux-cbd/wiki/Utils)|
| :------------- | :------------- |
| @[Consume](https://github.com/Neloreck/redux-cbd/wiki/@Consume) | [ReactContextManager](https://github.com/Neloreck/redux-cbd/wiki/ReactContextManager) |
| @[Provide](https://github.com/Neloreck/redux-cbd/wiki/@Provide) | - |


## Example (wiki contains more explanations):

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

  private static ASYNC_USER_CHANGE_DELAY: number = 3000;

  // Default context state.
  protected readonly context: IAuthContext = {
    // Some kind of handlers.
    authActions: {
      changeAuthenticationStatus: this.changeAuthenticationStatus,
      setUserAsync: this.setUserAsync,
      setUser: this.setUser
    },
    // Provided storage.
    authState: {
      isAuthenticated: true,
      user: "anonymous"
    }
  };

  @Bind()
  public changeAuthenticationStatus(): void {
    this.context.authState.isAuthenticated = !this.context.authState.isAuthenticated;
    this.update();
  }

  @Bind()
  public setUser(user: string): void {
    this.context.authState.user = user;
    this.update();
  }

  @Bind()
  public setUserAsync(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.context.authState.user = "user-" + Math.floor(Math.random() * 10000);
        this.update();

        resolve();
      }, AuthContextManager.ASYNC_USER_CHANGE_DELAY)
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

@Provide(authContextManager)
@Consume(authContextManager)
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

<details><summary>Pure JS example:</summary>
<p>
    
```javascript jsx
import * as React from "react";
import {PureComponent} from "react";
import {render} from "react-dom";

import {Consume, Provide, ReactContextManager} from "@redux-cbd/context";

// Data store.

export class AuthContext extends ReactContextManager {

  changeAuthenticationStatus = () => {
    this.state.authState.isAuthenticated = !this.state.authState.isAuthenticated;
    this.update();
  };

  setUser = (user) => {
    this.state.authState.user = user;
    this.update();
  };

  setUserAsync = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.state.authState.user = "user-" + Math.floor(Math.random() * 10000);
        this.update();
        resolve();
      }, 3000)
    });
  };

  // Wrap your actions and state separately to avoid naming collisions.
  context = {
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

}

const authContext = new AuthContext();

// View.

/*
 * Single provide-consume component.
 * Actually, only one module component (for example, router) should provide context.
 * All you need - inject props by consuming.
 */
@Provide(authContext)
@Consume(authContext)
export class MainView extends PureComponent {

  render() {
    const {
      label,
      authState: {user, isAuthenticated},
      authActions: {setUser, setUserAsync, changeAuthenticationStatus}
    } = this.props;

    const paddingStyle = { padding: "10px" };

    return (
      <div style={paddingStyle}>

        <div> External prop value: '{ label }' </div>

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

// Render into DOM.

render(
  <div>
    <MainView label={ "First component." }/> 
    <MainView label={ "Second component." }/>
  </div>,
  document.getElementById("application-root")
);

```

## Documentation:

Repository [wiki](https://github.com/Neloreck/redux-cbd/wiki) includes docs and samples. <br/>

## Proposals and contribution:

Feel free to contibute or mail me with questions/proposals/issues (Neloreck@gmail.com). <br/>

## Full examples

Repository includes example project with commentaries: <a href='https://github.com/Neloreck/redux-cbd/tree/master/examples'>link</a>. <br/>
My own 'redux-cbd' based project: <a href='https://github.com/Neloreck/x-core'>link</a>. <br/>
Library unit tests also include some different examples of cbd usage.

## Licence

MIT
