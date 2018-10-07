import {Action, combineReducers, Store, applyMiddleware, createStore, Middleware, Reducer} from "redux";
import {CBDStoreManager, cbdMiddleware} from "redux-cbd";

// Whole store bundle interface.
import {IGlobalStoreState} from "./IGlobalStoreState";

// Demo reducer class and its state.
import {DemoReducerState} from "../demo/state/DemoReducerState";
import {DemoReducer} from "../demo/reducer/DemoReducer";

// Custom push-into-static-array middleware.
import {logInConnectedComponentMiddleware} from "../../view/logInConnectedComponentMiddleware";

export class GlobalStoreManager extends CBDStoreManager {

  private static STORE_KEY: string = "GLOBAL_STORE";
  private static store: Store<IGlobalStoreState, Action<any>>;

  // Creating store. Singleton instance for whole app. Also, we can use @Single decorator there. (if we will iml it)
  private createStore(): Store<IGlobalStoreState, Action<any>> {
    const middlewares: Array<Middleware> = [cbdMiddleware, logInConnectedComponentMiddleware];
    return createStore(this.createRootReducer(), applyMiddleware(...middlewares));
  }

  // Creating root reducer, based on our application global state.
  // Strongly recommend to create model/module related ones instead of page-related. For example: auth, userSetting etc.
  private createRootReducer(): Reducer<IGlobalStoreState> {
    // new DemoReducer().asFunctional(new DemoReducerState(), { freezeState: true })
    // is same to
    // createReflectiveReducer(DemoReducer, new DemoReducerState(), { freezeState: true })
    //
    // reducers created in a default way are supposed to work as intended

    return combineReducers( {
      demoReducer: new DemoReducer().asFunctional(new DemoReducerState(), { freezeState: true })
    });
  }

  // Unique store key for provider, default is 'store'.
  public getStoreKey(): string {
    return GlobalStoreManager.STORE_KEY;
  }

  // Singleton store getter.
  public getStore(): Store<IGlobalStoreState, Action<any>> {

    if (!GlobalStoreManager.store) {
      GlobalStoreManager.store = this.createStore();
    }

    return GlobalStoreManager.store;
  }

}
