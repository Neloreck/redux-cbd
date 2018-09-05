import {SyncReduxAction} from "../";

export function createAsyncActionType(dispatch) {
  return class AsyncReduxAction extends SyncReduxAction {

    protected dispatch<T extends SyncReduxAction>(action: T): void {
      return dispatch(action);
    }

  }
}
