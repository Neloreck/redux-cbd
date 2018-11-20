import {Bind} from "@redux-cbd/utils";

import {ReactContextManager} from "@redux-cbd/context";

export interface IAuthContextState {
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

export class AuthContext extends ReactContextManager<IAuthContextState> {

  protected readonly state: IAuthContextState = {
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

  @Bind()
  public changeAuthenticationStatus(): void {
    this.state.authState = { ...this.state.authState, isAuthenticated: !this.state.authState.isAuthenticated };
    this.update();
  }

  @Bind()
  public setUser(user: string): void {
    this.state.authState = { ...this.state.authState, user };
    this.update();
  }

  @Bind()
  public setUserAsync(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.state.authState = {...this.state.authState, user: "user-" + Math.floor(Math.random() * 10000)};
        this.update();
        resolve();
      }, 3000)
    });
  }

}