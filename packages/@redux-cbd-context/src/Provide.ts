import * as React from "react";
import {ComponentType} from "react";

import {ReactContextManager} from "./ReactContextManager";

export const Provide =
  (...managers: Array<ReactContextManager<any>>) => <ComponentTargetType extends ComponentType<any>>(target: ComponentTargetType) => {

    let element!: ComponentType;

    for (const manager of managers) {

      const scopedElement = element || target;

      element = (renderProps: any) => React.createElement(manager.getProvider(), renderProps, React.createElement(scopedElement, renderProps));
    }

    return element as any;
  };
