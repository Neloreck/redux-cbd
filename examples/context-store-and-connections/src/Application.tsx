import * as React from "react";
import {render} from "react-dom";

import {EntryPoint} from "@redux-cbd/utils";
import {MainView, IMainViewExternalProps} from "./view/MainView";

@EntryPoint()
export class Application {

  /*
   * { ...{} as IConnectedComponentExternalProps } is the trick for correct types handling.
   * Actually, connected component is different from the one we exported with 'export class'.
   * We should use default export with separate props cast or make such mock trick.
   * (I prefer second style with single class declaration and DIRECTLY NAMED imports, which are better).
   */
  public static main(): void {
    render(<div>
      <MainView someLabelFromExternalProps={ "First component." } { ...{} as IMainViewExternalProps }/>
      <MainView someLabelFromExternalProps={ "Second component." } { ...{} as IMainViewExternalProps }/>
    </div>, document.getElementById("application-root"));
  }

}
