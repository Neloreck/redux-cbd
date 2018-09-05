import {Dispatch} from "redux";
import {SyncReduxAction} from "../";

export function createAsyncActionType(dispatch: Dispatch) {
  return class AsyncReduxAction extends SyncReduxAction {

    public dispatch<T extends SyncReduxAction>(action: T): T {
       return dispatch(action);
    }

  }
}
