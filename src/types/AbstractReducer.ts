import {Action} from "redux";

import {createReflectiveReducer, IReducerConfig} from "../";
import {SyncReduxAction} from "./SyncReduxAction";

type actionFunc<T> = (s: T, a: SyncReduxAction) => T;
type asFunctional<T> = (s: T, c: IReducerConfig) => ((prevState: T, action: Action) => T );

export abstract class AbstractReducer<T> {

  [index: string]: actionFunc<T> | asFunctional<T>;

  public asFunctional(defaultState: T, config: IReducerConfig): (prevState: T, action: Action) => T {
    return createReflectiveReducer(this, defaultState, config);
  }

}