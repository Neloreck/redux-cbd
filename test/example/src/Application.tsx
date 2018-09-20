import * as React from "react";
import {render} from "react-dom";

import {ConnectedComponent, IConnectedComponentExternalProps} from "./view/ConnectedComponent";
import {GlobalReduxProvider, reduxGlobalStoreManager} from "./data/redux";

export class Application {

  public render(): void {

    // We can set params as optional, but this will cause many troubles for most of use-cases.
    // Most of containers will be created by router, so we will not care (only higher order layouts are tricky).

    // Creating one root element is better solution. Also, you can extend pureComponent there and move render to main.ts

    render(<GlobalReduxProvider store={reduxGlobalStoreManager.getStore()}>
      <ConnectedComponent { ...{} as IConnectedComponentExternalProps }/>
    </GlobalReduxProvider>, document.getElementById("application-root"));
  }

}