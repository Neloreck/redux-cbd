import {Dispatch} from "redux";
import {SyncReduxAction} from "../";

export function createAsyncActionType(dispatchGetter: () => Dispatch) {

  return class AsyncReduxAction extends SyncReduxAction {

    public dispatch<T extends SyncReduxAction>(action: T): T {
       return dispatchGetter()(action);
    }

  }
}
