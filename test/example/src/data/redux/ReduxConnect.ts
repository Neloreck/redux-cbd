import {IReactComponentConnect, linkReactConnectWithStore} from "../../../../../src";

import {IReduxStoreState} from "./IReduxStoreState";
import {reduxGlobalStoreManager} from "./";

// Creating generic Connect decorator based on your own storage type and key.
export const GlobalReduxConnect: IReactComponentConnect<IReduxStoreState> =
    linkReactConnectWithStore<IReduxStoreState>(reduxGlobalStoreManager.getStoreKey());
