import {Provider} from "react-redux";
import {IReactComponentConnect, linkReactConnectWithStore} from "redux-cbd";

import {GlobalStoreManager} from "./GlobalStoreManager";
import {IGlobalStoreState} from "./IGlobalStoreState";

// Global store state typing, includes reducers for this one (can exist multiple stores in our app).
export {IGlobalStoreState} from  "./IGlobalStoreState";
// Global store manager. Creates store, providers, contains some info about store. Feel free to extend and modify.
export const globalStoreManager: GlobalStoreManager = new GlobalStoreManager();
// Global store provider.
export const GlobalStoreProvider: typeof Provider = globalStoreManager.getProvider();
// @Connect linked to global store, components can be wrapped in multiple connects.
export const withGlobalStoreConnection: IReactComponentConnect<IGlobalStoreState> =
  linkReactConnectWithStore<IGlobalStoreState>(globalStoreManager.getStoreKey());

