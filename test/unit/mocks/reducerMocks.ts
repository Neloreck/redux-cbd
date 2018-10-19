import {ActionHandler, ReflectiveReducer} from "../../../src";
import {AsyncWired, SimpleWired} from "./actionMocks";

export class MockReducerState {

  public asyncFired: boolean = false;
  public testNumber: number = -1;
  public testString: string = "initial";

}

export class MockReducer extends ReflectiveReducer<MockReducerState> {

  @ActionHandler
  public handleSimpleAction(state: MockReducerState, action: SimpleWired): MockReducerState {
    return { ...state, testString: action.payload.value};
  }

  @ActionHandler
  public handleAsyncAction(state: MockReducerState, action: AsyncWired): MockReducerState {
    return { ...state, asyncFired: true };
  }

}