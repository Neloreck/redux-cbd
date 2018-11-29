import {Bind, Single} from "@redux-cbd/utils";
import {ReactContextManager} from "@redux-cbd/context";

/*
 * Context manager state declaration.
 * You can inject it into your component props type later.
 */
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

/*
 * Manager class example, single store for app data.
 * Allows to create consumers/providers components or to use decorators for injection.
 *
 * Also, you can store something inside of it (additional props, static etc...) instead of modifying context state each time.
 */
@Single()
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
