import * as React from "react";
import {ComponentClass} from "react";

export const Wrapped =
  <ComponentProps, WrapProps>(WrapComponent: ComponentClass<WrapProps>, wrapProps?: WrapProps) =>
    (Target: ComponentClass<any>): any =>
      (props: ComponentProps) => React.createElement(WrapComponent, wrapProps, React.createElement(Target, props));
