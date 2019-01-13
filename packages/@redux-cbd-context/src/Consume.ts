import * as React from "react";
import {ComponentType} from "react";

import {ReactContextManager} from "./ReactContextManager";

export const Consume =
  (...managers: Array<ReactContextManager<any>>) =>
    <ComponentTargetType> (target: ComponentTargetType) => {
      
      let element!: ComponentType;
      
      for (const manager of managers) {
        
        let scopedElement = element || target;
        
        element = ((renderProps: object) => React.createElement(
          manager.getConsumer(),
          undefined,
          (contextProps: object) => React.createElement(scopedElement, { ...renderProps, ...contextProps }))) as any
      }
      
      return element as any;
    };
