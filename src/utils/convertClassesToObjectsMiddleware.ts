import {Action, Dispatch, Store} from "redux";

export const convertClassesToObjectsMiddleware = (store: Store) => (next: Dispatch) => (action: Action) => {
  next({ ...action});
};