import {ActionHandler, payloadValue, ReflectiveReducer} from "../../src";
import {ACTION_FROM_OUTSIDE, ActionsBundle, AsyncActionExample, ExchangeActionExample, SIMPLE_ACTION} from "./actionMocks";

export class MockReducerState {

  [index: string]: any;

  public asyncFired: boolean = false;
  public testNumber: number = -1;
  public testString: string = "initial";

}

export class MockReducer extends ReflectiveReducer<MockReducerState> {

  // Another way to declare action handler method. Intended to be used for library methods (redux-router, etc).
  @ActionHandler(SIMPLE_ACTION)
  public handleSimpleAction(state: MockReducerState, action: { payload: { value: string } }): MockReducerState {
    return { ...state, testString: action.payload.value};
  }

  @ActionHandler()
  public handleAsyncAction(state: MockReducerState, action: AsyncActionExample): MockReducerState {
    return { ...state, asyncFired: true };
  }

  // Kind of simple exchange actions with short declarations.
  @ActionHandler()
  public handleExchangeAction(state: MockReducerState, action: ExchangeActionExample): MockReducerState {
    return { ...state, testString: action.payload.value };
  }

  @ActionHandler(ACTION_FROM_OUTSIDE)
  public handleActionFromOutside(state: MockReducerState, action: { payload: { value: string } }): MockReducerState {
    return { ...state, testString: action.payload.value };
  }

  @ActionHandler(ActionsBundle.multiply)
  public handleFunctionalAction(state: MockReducerState, action: payloadValue<typeof ActionsBundle.multiply>): MockReducerState {
    return { ...state, testNumber: action.payload.value }
  }

}