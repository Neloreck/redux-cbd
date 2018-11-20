import * as React from "react";
import {ComponentType} from "react";

import {ReactContextManager} from "./ReactContextManager";

export const Consume =
  <ContextPropsType extends object, ComponentTargetPropsType extends object>(manager: ReactContextManager<ContextPropsType>) =>
    <ComponentTargetType extends ComponentType<ComponentTargetPropsType & ContextPropsType>> (target: ComponentTargetType) => {
      return ((renderProps: ContextPropsType) =>
        React.createElement(manager.getConsumer(), undefined, (props: ContextPropsType) => React.createElement(target, { ...(renderProps as any), ...(props as any) }))) as any;
    };
