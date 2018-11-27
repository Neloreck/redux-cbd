import * as React from "react";
import {PureComponent} from "react";
import {Consume, Provide} from "@redux-cbd/context";

// Store related things.
import {authContextManager, IAuthContext} from "../data";

// Props typing: own, injected and bundled props. You should know what has to be declared manually.
export interface IMainViewOwnProps { someLabelFromExternalProps: string; }
export interface IMainViewExternalProps extends IAuthContext {}
export interface IMainViewProps extends IMainViewExternalProps, IMainViewOwnProps {}

// Component related.
@Provide(authContextManager)
@Consume<IAuthContext, IMainViewProps>(authContextManager)
export class MainView extends PureComponent<IMainViewProps> {

  public render(): JSX.Element {
    const {
      // Own prop.
      someLabelFromExternalProps,
      // Get, what you need form injected props.
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
