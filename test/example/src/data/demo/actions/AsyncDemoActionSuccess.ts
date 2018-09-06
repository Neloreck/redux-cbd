import {ActionWired, SimpleAction} from "redux-cbd";

// Simple action, sets loading as false, changes stored number.
@ActionWired("ASYNC_TEST_ACTION_SUCCESS")
export class AsyncDemoActionSuccess extends SimpleAction {

  public payload: { loading: boolean, storedNumber: number } = { loading: true, storedNumber: -1 };

  public constructor(num: number) {
    super();
    
    this.payload.storedNumber = num;
  }
  
}
