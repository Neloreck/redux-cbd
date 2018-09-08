import {IReducerConfig} from "./IReducerConfig";
import {SimpleAction} from "../actions";
import {createReflectiveReducer} from "../utils";

type actionHandlerFunc<T> = (s: T, a: SimpleAction) => T;
type asFunctional<T> = (s: T, c: IReducerConfig) => ((prevState: T, action: SimpleAction) => T );

export abstract class ReflectiveReducer<T> {

  [index: string]: actionHandlerFunc<T> | asFunctional<T>;

  public asFunctional(defaultState: T, config: IReducerConfig): (prevState: T, action: SimpleAction) => T {
    return createReflectiveReducer(this, defaultState, config);
  }

}