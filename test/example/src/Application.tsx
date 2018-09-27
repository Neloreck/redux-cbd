import * as React from "react";
import {render} from "react-dom";

// Check doc for proper reducers and store creation guide.
import {GlobalStoreProvider, globalStoreManager} from "./data/redux";

// Our simple connected component.
import {ConnectedComponent, IConnectedComponentExternalProps} from "./view/ConnectedComponent";

// @Single
export class Application {

  public render(): void {

    // { ...{} as IConnectedComponentExternalProps } is the trick for correct types handling.
    // Actually, connected component is different from the one we exported with 'export class'.
    // We should use default export with separate props cast or make such mock trick.
    // (I prefer second style with single class declaration and DIRECTLY NAMED imports, which are better).

    // Actual JSX markup for rendering.
    const rootElement: JSX.Element = (
      <GlobalStoreProvider store={globalStoreManager.getStore()}>
        <ConnectedComponent someLabelFromExternalProps={ "Demo prop" } { ...{} as IConnectedComponentExternalProps }/>
      </GlobalStoreProvider>
    );

    // DOM target element.
    const targetElement: HTMLElement | null = document.getElementById("application-root");

    // Render into DOM.
    render(rootElement, targetElement);
  }

}
