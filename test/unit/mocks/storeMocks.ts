import {Action, applyMiddleware, combineReducers, createStore, Reducer, Store} from "redux";

import {MockReducer, MockReducerState} from "./reducerMocks";
import {cbdMiddleware} from "../../../src/lib/middleware";

export interface IStoreState {
  mockReducer: MockReducerState;
}

export const createReduxStore = (): Store<IStoreState, Action<any>> => {

  const rootReducer: Reducer<IStoreState> = combineReducers({
    mockReducer: new MockReducer().asFunctional(new MockReducerState(), { freezeState: true })
  });

  return createStore(rootReducer, applyMiddleware(...[cbdMiddleware]));
};
