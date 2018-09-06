import {SyncReduxAction} from "redux-cbd";
import {ReduxStoreManager} from "./ReduxStoreManager";

export class AsyncReduxAction extends SyncReduxAction {

  private store = new ReduxStoreManager().getStore();

  protected dispatch<T extends SyncReduxAction>(action: T): T {
    return this.store.dispatch(action);
  }

}