import * as React from "react";
import {ComponentType, PureComponent, ReactNode} from "react";

export function Wrapped<ComponentProps1, ComponentProps2>(
  WrapComponent: ComponentType<ComponentProps1>, wrapProps?: ComponentProps1) {

  return (Target: ComponentType<ComponentProps2>): any => class extends PureComponent {

    public render(): ReactNode {
      return React.createElement(WrapComponent, wrapProps, React.createElement(Target, this.props as ComponentProps2));
    }

  };

}