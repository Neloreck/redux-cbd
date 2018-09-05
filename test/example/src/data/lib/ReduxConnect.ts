import {linkReactConnectWithStore} from "redux-cbd";
import {IReduxStoreState} from "@Redux";

export const ReduxConnect = linkReactConnectWithStore<IReduxStoreState>();
