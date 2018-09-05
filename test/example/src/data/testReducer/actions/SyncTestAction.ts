import {ActionType, SyncReduxAction} from "redux-cbd";

@ActionType("SYNC_TEST_ACTION")
export class SyncTestAction extends SyncReduxAction {

  public payload: { test: number } = {
    test: -1
  };

  public constructor(newNum: number) {
    super();

    this.payload.test = newNum;
  }

}
