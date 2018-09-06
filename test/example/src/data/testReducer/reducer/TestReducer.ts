import {AbstractReducer, ActionHandler} from "redux-cbd";

import {TestState} from "../state/TestState";

import {SyncTestAction} from "../actions/SyncTestAction";
import {AsyncTestAction} from "../actions/AsyncTestAction";

export class TestReducer extends AbstractReducer<TestState>  {

  @ActionHandler
  public changeTestNumberGot(state: TestState, action: SyncTestAction): TestState {
    return { ...state, testNumber: action.payload.test, testLoading: false };
  }

  @ActionHandler
  public sendFakeChangeNumberRequest(state: TestState, action: AsyncTestAction): TestState {
    return { ...state, testLoading: action.payload.loading };
  }

}