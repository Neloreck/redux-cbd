import {ReactContextManager} from "@redux-cbd/context";
import {Bind} from "@redux-cbd/utils";

/*
 * Context manager state declaration.
 * You can inject it into your component props type later.
 */
export interface IDataContext {
  dataActions: {
    setValue: (value: string) => void;
  };
  dataState: {
    value: string;
  };
}

/*
 * Manager class example, single store for app data.
 * Allows to create consumers/providers components or to use decorators for injection.
 *
 * Also, you can store something inside of it (additional props, static etc...) instead of modifying state each time.
 */
export class DataContextManager extends ReactContextManager<IDataContext> {

  // Default context state.
  protected readonly context: IDataContext = {
    // Some kind of handlers.
    dataActions: {
      setValue: this.setValue
    },
    // Provided storage.
    dataState: {
        value: "value"
    }
  };

  @Bind()
  public setValue(value: string): void {
    this.context.dataState = { ...this.context.dataState, value };
    this.update();
  }

}
