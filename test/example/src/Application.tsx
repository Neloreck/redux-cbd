import * as React from "react";
import {Provider} from "react-redux";
import {render} from "react-dom";

import {ReduxStoreManager} from "./data/redux/ReduxStoreManager";
import {ConnectedComponent, IConnectedComponentProps} from "./view/ConnectedComponent";

export class Application {

  public render(): void {

    // We can set params as optional, but this will cause many troubles for most of use-cases.
    // Most of containers will be created by router, so we will not care (only higher order layouts are tricky).

    // Creating one root element is better solution. Also, you can extend pureComponent there and move render to main.ts

    render(<Provider store={new ReduxStoreManager().getStore()}>
      <ConnectedComponent { ...{} as IConnectedComponentProps }/>
    </Provider>, document.getElementById("application-root"));
  }

}