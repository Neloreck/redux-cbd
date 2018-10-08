import {IReactComponentConnect, linkReactConnectWithStore} from "redux-cbd";

import {GlobalStoreManager} from "./GlobalStoreManager";
import {IGlobalStoreState} from "./IGlobalStoreState";

/* Global store state typing, includes reducers for this one (can exist multiple stores in our app). */
export {IGlobalStoreState} from  "./IGlobalStoreState";
/* Singleton store manager. Creates store, providers, contains some info about store. */
export const globalStoreManager: GlobalStoreManager = new GlobalStoreManager();
/* Global store provider wrapper, provides correct store and store key for connection. No need to manage store manually. */
export const GlobalStoreProvider = globalStoreManager.getProvider();
/* @Connect decorator annotation linked to global store, components can be wrapped in multiple connects with different stores. */
export const GlobalStoreConnect: IReactComponentConnect<IGlobalStoreState> =
  linkReactConnectWithStore<IGlobalStoreState>(globalStoreManager.getStoreKey());

