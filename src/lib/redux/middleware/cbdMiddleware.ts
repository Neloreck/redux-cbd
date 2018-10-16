import {Dispatch, MiddlewareAPI} from "redux";

import {SimpleAction, EActionClass, AsyncAction, ComplexAction} from "../actions";
import {EMetaData} from "../../general/type";

export const cbdMiddleware = (middlewareAPI: MiddlewareAPI) => (next: Dispatch) => (action: SimpleAction & AsyncAction
  & ComplexAction) => {

  if (!action || !action.constructor) {
    // We don't handle errors and other things there, let redux or other middlewares do it.
    return next(action);
  }

  // Get internal type of action or fallback to object action.
  const actionType: EActionClass = Reflect.getMetadata(EMetaData.ACTION_CLASS, action.constructor) || EActionClass.OBJECT_ACTION;

  switch (actionType) {

    case EActionClass.SIMPLE_ACTION:
    case EActionClass.EXCHANGE_ACTION:
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    case EActionClass.COMPLEX_ACTION:
      action.act();
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    case EActionClass.ASYNC_ACTION:
      setTimeout(() => action.act().then(action.afterSuccess).catch(action.afterError).then(middlewareAPI.dispatch));
      return next({ type: action.getActionType(), payload: action.getActionPayload() });

    default:
      return next(action);
  }
};
