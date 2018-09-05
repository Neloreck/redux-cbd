import {AbstractReducer, ActionHandler} from "redux-cbd";

import {TestState} from "../state/TestState";
import {SyncTestAction} from "../actions/SyncTestAction";

export class TestReducer extends AbstractReducer<TestState>  {

  @ActionHandler
  public changeTestNumber(state: TestState, action: SyncTestAction): TestState {
    return { ...state, testNumber: action.payload.test };
  }

}