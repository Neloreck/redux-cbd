import {linkReactConnectWithStore} from "redux-cbd";

import {IReduxStoreState} from "./IReduxStoreState";

// Creating generic Connect decorator based on your own storage type.
export const ReduxConnect = linkReactConnectWithStore<IReduxStoreState>();