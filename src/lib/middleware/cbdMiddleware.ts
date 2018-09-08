import {Dispatch, Store} from "redux";
import {SimpleAction, EActionType, AsyncAction, ComplexAction} from "../actions";

export const cbdMiddleware = (store: Store) => (next: Dispatch) => (action: SimpleAction & AsyncAction
  & ComplexAction) => {

  const actionType: EActionType = (Object.getPrototypeOf(action).constructor.getInternalType &&
    Object.getPrototypeOf(action).constructor.getInternalType()) || EActionType.OBJECT_ACTION;

  switch (actionType) {

    case EActionType.SIMPLE_ACTION:
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    case EActionType.COMPLEX_ACTION:
      action.act();
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    case EActionType.ASYNC_ACTION:
      setTimeout(() => action.act().then(action.afterSuccess).catch(action.afterError).then(store.dispatch));
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    default:
      return next(action);
  }
};
