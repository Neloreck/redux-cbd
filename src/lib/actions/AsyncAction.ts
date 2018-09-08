import {SimpleAction} from "./SimpleAction";
import {EActionType} from "./EActionType";

// Todo: Unify act and afterSuccess methods.

export abstract class AsyncAction extends SimpleAction {

  public static readonly _internalType: EActionType = EActionType.ASYNC_ACTION;

  public constructor() {
      super();
  }

  // Do some complex things after dispatch based on own params.
  public abstract act(): Promise<any>;

  public abstract afterSuccess(result: any): SimpleAction;

  public afterError(error: Error): SimpleAction {
    throw new Error(`Async action execution failed: ${this.getActionType()}. Error: ${error.message}.`);
  };

}
