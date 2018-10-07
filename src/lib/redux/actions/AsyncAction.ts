import {SimpleAction} from "./SimpleAction";
import {EActionClass} from "./EActionClass";
import {EMetaData} from "../../general/type";

// Todo: Unify act and afterSuccess methods.

@Reflect.metadata(EMetaData.ACTION_CLASS, EActionClass.ASYNC_ACTION)
export abstract class AsyncAction extends SimpleAction {

  // Do some complex things after dispatch based on own params.
  public abstract act(): Promise<any>;

  public abstract afterSuccess(result: any): SimpleAction;

  public afterError(error: Error): SimpleAction {
    throw new Error(`Async action execution failed: ${this.getActionType()}. Error: ${error.message}.`);
  };

}
