import {TestState} from "../testReducer/state/TestState";
import {TestReducer} from "../testReducer/reducer/TestReducer";
import {combineReducers} from "redux";

export class ReducerCreator {

  public createRootReducer() {
    return combineReducers( {
      testReducer: new TestReducer().asFunctional(new TestState(), { freezeState: true }),
    });
  }

}