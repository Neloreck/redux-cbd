import * as React from "react";
import {ComponentType, PureComponent} from "react";

export function Wrapped<ComponentProps1, ComponentProps2>(
  WrapComponent: ComponentType<ComponentProps1>, wrapProps?: ComponentProps1) {

  return (Target: ComponentType<ComponentProps2>): any => class extends PureComponent {

    public render(): JSX.Element {
      return (
        <WrapComponent {...wrapProps}>
          <Target {...this.props}/>
        </WrapComponent>
      );
    }

  };

}
