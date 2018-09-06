import {Action, combineReducers, Store} from "redux";
import {applyMiddleware, createStore, Middleware} from "redux";
import {convertClassesToObjectsMiddleware} from "redux-cbd";

import {IReduxStoreState} from "./IReduxStoreState";
import {TestReducer} from "../testReducer/reducer/TestReducer";
import {TestState} from "../testReducer/state/TestState";

export class ReduxStoreManager {

  private static store: Store<IReduxStoreState, Action<any>> & { dispatch: () => {} };

  private static createStore(): Store<IReduxStoreState, Action<any>> & { dispatch: () => {} } {
    const middlewares: Array<Middleware> = [convertClassesToObjectsMiddleware];
    return createStore(this.createRootReducer(), applyMiddleware(...middlewares));
  }

  private static createRootReducer() {
    return combineReducers( {
      testReducer: new TestReducer().asFunctional(new TestState(), { freezeState: true }),
    });
  }

  public getStore(): Store<IReduxStoreState, Action<any>> & { dispatch: () => {} } {

    if (!ReduxStoreManager.store) {
      ReduxStoreManager.store = ReduxStoreManager.createStore();
    }

    return ReduxStoreManager.store;
  }

}
