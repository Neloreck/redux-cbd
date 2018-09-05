import {Dispatch} from "redux";
import {SyncReduxAction} from "../";

export function createAsyncActionType(dispatch: Dispatch) {
  return class AsyncReduxAction extends SyncReduxAction {

    protected dispatch<T extends SyncReduxAction>(action: T): T {
      return dispatch(action);
    }

  }
}
