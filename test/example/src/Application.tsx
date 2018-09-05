import * as React from "react";
import {PureComponent} from "react";
import {Provider} from "react-redux";

import {ConnectedComponent} from "./view/ConnectedComponent";
import {store} from "./data";

export class Application extends PureComponent {

  public render(): JSX.Element {
    return (
      <Provider store={store}>
        <ConnectedComponent/>
      </Provider>
    );
  }

}