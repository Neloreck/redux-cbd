import {Consume, Provide} from "@redux-cbd/context";
import * as React from "react";
import {PureComponent, ReactNode} from "react";

// Store related things.
import {authContextManager, dataContextManager, IAuthContext, IDataContext} from "../data";


// Props typing: own, injected and bundled props. You should know what has to be declared manually.
export interface IMainViewOwnProps { someLabelFromExternalProps: string; }
export interface IMainViewExternalProps extends IAuthContext, IDataContext {}
export interface IMainViewProps extends IMainViewExternalProps, IMainViewOwnProps {}

// Component related.
@Provide(authContextManager, dataContextManager)
@Consume(authContextManager, dataContextManager)
export class MainView extends PureComponent<IMainViewProps> {

  public render(): ReactNode {

    const {
      // Own prop.
      someLabelFromExternalProps,
      // Get, what you need form injected props.
      dataState: {value},
      dataActions: {setValue},
      authState: {user, isAuthenticated},
      authActions: {setUser, setUserAsync, changeAuthenticationStatus}
    } = this.props;

    const rootStyle = { border: "2px black solid", margin: 12, padding: 12 };
    const sectionStyle = { padding: 8 };

    return (
      <div style={rootStyle}>

        <div> External prop value: '{ someLabelFromExternalProps }' </div>

        <div style={sectionStyle}>

          <h5> Auth context: </h5>
          <span>USERNAME: </span> {user} <br/>
          <span>AUTHENTICATED: </span>  {isAuthenticated.toString()} <br/>
  
          <button onClick={changeAuthenticationStatus}>Change Authentication Status</button>
          <button onClick={setUserAsync}>Randomize User Async</button>
          <button onClick={() => setUser("user-" + Math.floor(Math.random() * 100))}>Randomize User</button>
       
        </div>

        <div style={sectionStyle}>

          <h5> Data context: </h5>
          <span>VALUE: </span> {value} <br/>

          <button onClick={() => setValue("value-" + Math.floor(Math.random() * 100))}>Randomize Value</button>

        </div>

      </div>
    );
  }

}
