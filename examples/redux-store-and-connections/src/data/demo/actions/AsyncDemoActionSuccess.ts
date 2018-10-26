import {ActionWired, SimpleAction} from "@redux-cbd/core";

// Simple action, sets loading as false, changes stored number.
@ActionWired("ASYNC_TEST_ACTION_SUCCESS")
export class AsyncDemoActionSuccess extends SimpleAction {

  public readonly payload: { loading: boolean, storedNumber: number } = { loading: false, storedNumber: -1 };

  public constructor(num: number) {
    super();
    
    this.payload.storedNumber = num;
  }
  
}
