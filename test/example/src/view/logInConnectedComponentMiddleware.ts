import {Action, Dispatch, Middleware, MiddlewareAPI} from "redux";

// !!! DEMO ONLY.

// For demo purposes only. Accessing static context from outside and rendering in a such way is bad idea for production.
// Example of redux middleware. You can do anything there.
export const logInConnectedComponentMiddleware: Middleware = (api: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {

  // Component should not know directly about our store, resolving circular dependency.
  const {ConnectedComponent} = require("./ConnectedComponent");

  ConnectedComponent.actionsLog.push(action);
  next(action);
};
