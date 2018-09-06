import {ActionWired, SimpleAction} from "redux-cbd";

// Just simple action. Middleware gets type and payload, then maps into object before throwing it inside reducer.
@ActionWired("SIMPLE_TEST_ACTION")
export class SimpleDemoAction extends SimpleAction {

  public payload: { storedNumber: number } = { storedNumber: 0 };

  public constructor(num: number) {
    super();

    this.payload.storedNumber = num;
  }

}
