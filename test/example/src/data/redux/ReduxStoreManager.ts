import {Action, Store} from "redux";
import {applyMiddleware, createStore, Middleware} from "redux";
import {convertClassesToObjectsMiddleware} from "redux-cbd";

import {IReduxStoreState} from "./IReduxStoreState";
import {ReducerCreator} from "./ReducerCreator";

export class ReduxStoreManager {

  private static store: Store<IReduxStoreState, Action<any>> & { dispatch: () => {} };

  private static createStore(): Store<IReduxStoreState, Action<any>> & { dispatch: () => {} } {
    const middlewares: Array<Middleware> = [convertClassesToObjectsMiddleware];

    return createStore(new ReducerCreator().createRootReducer(), applyMiddleware(...middlewares));
  }

  public getStore(): Store<IReduxStoreState, Action<any>> & { dispatch: () => {} } {

    if (!ReduxStoreManager.store) {
      ReduxStoreManager.store = ReduxStoreManager.createStore();
    }

    return ReduxStoreManager.store;
  }

}
