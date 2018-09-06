import {SyncReduxAction} from "redux-cbd";
import {ReduxStoreManager} from "./ReduxStoreManager";

export class AsyncReduxAction extends SyncReduxAction {

  private managerInstance: ReduxStoreManager = new ReduxStoreManager();

  protected dispatch<T extends SyncReduxAction>(action: T): T {
    return this.managerInstance.getStore().dispatch(action);
  }

}