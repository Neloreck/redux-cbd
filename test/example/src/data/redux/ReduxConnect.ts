import {linkReactConnectWithStore} from "redux-cbd";
import {IReduxStoreState} from "./IReduxStoreState";

export const ReduxConnect = linkReactConnectWithStore<IReduxStoreState>();