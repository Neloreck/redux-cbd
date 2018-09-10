import {Action, Dispatch, Middleware, MiddlewareAPI} from "redux";

import {ConnectedComponent} from "../../view/ConnectedComponent";

// For demo purposes only. Accessing static context from outside and rendering in a such way is bad idea for production.
// Example of redux middleware. You can do anything there.
export const logInConnectedComponentMiddleware: Middleware = (api: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
  ConnectedComponent.actionsLog.push(action);
  next(action);
};
