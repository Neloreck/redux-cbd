import {Action, combineReducers, Store, applyMiddleware, createStore, Middleware, Reducer} from "redux";
import {cbdMiddleware} from "redux-cbd";

// Whole store bundle interface.
import {IReduxStoreState} from "./IReduxStoreState";

// Demo reducer class and its state.
import {DemoReducerState} from "../demo/state/DemoReducerState";
import {DemoReducer} from "../demo/reducer/DemoReducer";

// Custom push-into-static-array middleware.
import {logInConnectedComponentMiddleware} from "./logInConnectedComponentMiddleware";

import {CBDStoreManager} from "../../../../../src/lib/reducers/CBDStoreManager";

export class ReduxStoreManager extends CBDStoreManager {

  private static STORE_KEY: string = "GLOBAL_STORE";
  private static store: Store<IReduxStoreState, Action<any>> & { dispatch: () => {} };

  // Creating store. Signgleton instance for whole app. Also, we can use @Single decorator there. (if we will iml it)
  private static createStore(): Store<IReduxStoreState, Action<any>> & { dispatch: () => {} } {
    const middlewares: Array<Middleware> = [cbdMiddleware, logInConnectedComponentMiddleware];
    return createStore(ReduxStoreManager.createRootReducer(), applyMiddleware(...middlewares));
  }

  // Creating root reducer, based on our application global state.
  // Strongly recommend to create model/module related ones instead of page-related. For example: auth, userSetting etc.
  private static createRootReducer(): Reducer<IReduxStoreState> {
    // new DemoReducer().asFunctional(new DemoReducerState(), { freezeState: true })
    // is same to
    // createReflectiveReducer(DemoReducer, new DemoReducerState(), { freezeState: true })
    //
    // reducers created in a default way are supposed to work as intended

    return combineReducers( {
      demoReducer: new DemoReducer().asFunctional(new DemoReducerState(), { freezeState: true })
    });
  }

  public getStoreKey(): string {
    return ReduxStoreManager.STORE_KEY;
  }

  // Singleton store getter.
  public getStore(): Store<IReduxStoreState, Action<any>> & { dispatch: () => {} } {

    if (!ReduxStoreManager.store) {
      ReduxStoreManager.store = ReduxStoreManager.createStore();
    }

    return ReduxStoreManager.store;
  }

}
