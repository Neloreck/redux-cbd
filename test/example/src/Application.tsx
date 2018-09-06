import * as React from "react";
import {Provider} from "react-redux";
import {render} from "react-dom";

import {ConnectedComponent} from "./view/ConnectedComponent";
import {ReduxStoreManager} from "./data/redux/ReduxStoreManager";

export class Application {

  public render(): void {

    // We can set params as optional, but this will cause many troubles for most of use-cases.
    // Most of containers will be created by router, so we will not care (only higher order layouts are tricky).

    render(<Provider store={new ReduxStoreManager().getStore()}>
      <ConnectedComponent { ...{
        testValue: 0,
        testLoading: false,
        syncTestAction: () => {},
        asyncTestAction: () => {}
      } }/>
    </Provider>, document.getElementById("app-root"));
  }

}