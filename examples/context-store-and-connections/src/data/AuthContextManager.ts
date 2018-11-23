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