import * as React from "react";
import {PureComponent} from "react";
import {render} from "react-dom";

import {Consume, Provide, ReactContextManager} from "@redux-cbd/context";

// Data.

export class AuthContext extends ReactContextManager {

  changeAuthenticationStatus = () => {
    this.state.authState = { ...this.state.authState, isAuthenticated: !this.state.authState.isAuthenticated };
    this.update();
  };

  setUser = (user) => {
    this.state.authState = { ...this.state.authState, user };
    this.update();
  };

  setUserAsync = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.state.authState = {...this.state.authState, user: "user-" + Math.floor(Math.random() * 10000)};
        this.update();
        resolve();
      }, 3000)
    });
  };

  state = {
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

@Provide(authContext)
@Consume(authContext)
export class MainView extends PureComponent {

  render() {
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

render(<div>
    <MainView someLabelFromExternalProps={ "First component." }/>
    <MainView someLabelFromExternalProps={ "Second component." }/>
  </div>, document.getElementById("application-root"));
