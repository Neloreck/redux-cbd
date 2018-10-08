import * as React from "react";
import {render} from "react-dom";
import {Single} from "redux-cbd";

/* Store provider. Injects store for @Connect consumers. */
import {GlobalStoreProvider} from "./data/redux";

/* Demo component with its external props. No need to import props if component is not decorated with injection. */
import {ConnectedComponent, IConnectedComponentExternalProps} from "./view/ConnectedComponent";

@Single
export class Application {

  /*
   * { ...{} as IConnectedComponentExternalProps } is the trick for correct types handling.
   * Actually, connected component is different from the one we exported with 'export class'.
   * We should use default export with separate props cast or make such mock trick.
   * (I prefer second style with single class declaration and DIRECTLY NAMED imports, which are better).
   */
  public render(): void {
    render( <GlobalStoreProvider>
      <ConnectedComponent someLabelFromExternalProps={ "Demo prop" } { ...{} as IConnectedComponentExternalProps }/>
    </GlobalStoreProvider>, document.getElementById("application-root"));
  }

}
