import {createAsyncActionType} from "redux-cbd";
import {store} from "../"

export const AsyncReduxAction = createAsyncActionType(store.dispatch);
