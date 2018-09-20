import {IReactComponentConnect, linkReactConnectWithStore} from "redux-cbd";

import {IReduxStoreState} from "./IReduxStoreState";
import {reduxGlobalStoreManager} from "./index";

// Creating generic Connect decorator based on your own storage type.
export const GlobalReduxConnect: IReactComponentConnect<IReduxStoreState> = linkReactConnectWithStore(reduxGlobalStoreManager.getStoreKey())<IReduxStoreState>();