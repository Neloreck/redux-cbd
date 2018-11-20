import * as React from "react";
import {ComponentType} from "react";

import {ReactContextManager} from "./ReactContextManager";

export const Provide =
  (manager: ReactContextManager<any>) =>
    <ComponentTargetType extends ComponentType<any>>(target: ComponentTargetType) => {
      return ((renderProps: any) => React.createElement(manager.getProvider(), undefined, React.createElement(target, { ...renderProps }))) as any;
    };
