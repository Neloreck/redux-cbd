import {Action, Reducer} from "redux";

import {IReducerConfig} from "./IReducerConfig";
import {SimpleAction} from "../actions/index";
import {createReflectiveReducer} from "../utils/index";

export type actionHandlerFunc<T> = (s: T, a: any) => T;
export type asFunctional<T> = (s: T, c: IReducerConfig) => ((prevState: T, action: SimpleAction) => T );
export type reducerMap<T> = {
  [index: string]: (<A> (s: T, a: A) => T ) | asFunctional<T>;
}

export abstract class ReflectiveReducer<T> {

  [index: string]: actionHandlerFunc<T> | asFunctional<T>;

  public asFunctional(defaultState: T, config: IReducerConfig): Reducer<T, Action> {
    return createReflectiveReducer(this, defaultState, config);
  }

}