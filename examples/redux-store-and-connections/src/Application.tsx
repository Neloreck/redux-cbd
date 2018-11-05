import * as React from "react";
import {render} from "react-dom";

import {EntryPoint} from "@redux-cbd/utils";

/* Store provider. Injects store for @Connect consumers. */
import {GlobalStoreProvider} from "./data";

import {ConnectedComponent, IConnectedComponentExternalProps} from "./view/ConnectedComponent";

@EntryPoint()
export class Application {

  /*
   * { ...{} as IConnectedComponentExternalProps } is the trick for correct types handling.
   * Actually, connected component is different from the one we exported with 'export class'.
   * We should use default export with separate props cast or make such mock trick.
   * (I prefer second style with single class declaration and DIRECTLY NAMED imports, which are better).
   */
  public static main(): void {
    render( <GlobalStoreProvider>
      <ConnectedComponent someLabelFromExternalProps={ "Demo prop" } { ...{} as IConnectedComponentExternalProps }/>
    </GlobalStoreProvider>, document.getElementById("application-root"));
  }

}
