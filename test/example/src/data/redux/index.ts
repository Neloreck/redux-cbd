import {Provider} from "react-redux";
import {ReduxStoreManager} from "./ReduxStoreManager";

export const reduxGlobalStoreManager: ReduxStoreManager = new ReduxStoreManager();
export const GlobalReduxProvider: typeof Provider = reduxGlobalStoreManager.getProvider();
