import {Action, combineReducers, Store} from "redux";
import {applyMiddleware, createStore, Middleware} from "redux";

import {convertClassesToObjectsMiddleware} from "redux-cbd";
import {TestReducer} from "./testReducer/reducer/TestReducer";
import {TestState} from "./testReducer/state/TestState";

export interface IReduxStoreState {
  testReducer: TestState;
}

export class ReduxStoreManager {

  public createStore(): Store<IReduxStoreState, Action<any>> & { dispatch: () => {} } {
    const middlewares: Array<Middleware> = [convertClassesToObjectsMiddleware];
    return createStore(this.createRootReducer(), applyMiddleware(...middlewares));
  }

  private createRootReducer() {
    return combineReducers( {
      testReducer: new TestReducer().asFunctional(new TestState(), { freezeState: true }),
    });
  }

}
