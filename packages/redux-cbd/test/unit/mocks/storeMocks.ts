import {Action, applyMiddleware, combineReducers, createStore, Reducer, Store} from "redux";

import {MockReducer, MockReducerState} from "./reducerMocks";
import {cbdMiddleware, CBDStoreManager, StoreManaged} from "../../../src";

export const STORE_KEY: string = "TEST_STORE";

export interface IStoreState {
  mockReducer: MockReducerState;
}

@StoreManaged(STORE_KEY)
export class TestStoreManager extends CBDStoreManager<IStoreState> {

  public createStore(): Store<IStoreState, Action<any>> {

    const rootReducer: Reducer<IStoreState> = combineReducers({
      mockReducer: new MockReducer().asFunctional(new MockReducerState(), { freezeState: true })
    });

    return createStore(rootReducer, applyMiddleware(...[cbdMiddleware]));
  }

}

export const testStoreManager = new TestStoreManager();
