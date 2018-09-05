import {ReduxStoreManager} from "./ReduxStoreManager";

export const reduxStoreManager: ReduxStoreManager = new ReduxStoreManager();
export const store = reduxStoreManager.createStore();