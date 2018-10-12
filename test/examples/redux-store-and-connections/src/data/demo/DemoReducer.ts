import {ActionHandler, ReflectiveReducer} from "redux-cbd";

import {DemoState} from "./DemoState";
import {
  AsyncDemoAction, AsyncDemoActionSuccess, ComplexDemoAction, DataExchangeDemoAction, SimpleDemoAction
} from "./actions";

// Reducer class. Typing allows you to create ONLY methods with two params - <genericState, actionType>.
// Looks for method with same action type and executes it. Just like functional reducer with switch, but better.
export class DemoReducer extends ReflectiveReducer<DemoState>  {

  @ActionHandler
  public changeStoredNumber(state: DemoState, action: SimpleDemoAction): DemoState {
    return { ...state, storedNumber: action.payload.storedNumber };
  }

  @ActionHandler
  public exchangeSomeData(state: DemoState, action: DataExchangeDemoAction): DemoState {
    return { ...state, storedNumber: action.payload.storedNumber };
  }

  @ActionHandler
  public startLoadingOnAsyncActionReceived(state: DemoState, action: AsyncDemoAction): DemoState {
    return { ...state, loading: action.payload.loading };
  }

  @ActionHandler
  public finishFakeLoading(state: DemoState, action: AsyncDemoActionSuccess): DemoState {
    return { ...state, storedNumber: action.payload.storedNumber, loading: false };
  }

  @ActionHandler
  public handleComplexAction(state: DemoState, action: ComplexDemoAction): DemoState {
    return { ...state, storedNumber: action.payload.storedNumber };
  }


}
