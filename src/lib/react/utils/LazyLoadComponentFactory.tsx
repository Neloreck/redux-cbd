import * as React from "react";
import {Component, ComponentType} from "react";

interface ILazyComponentState {
  component: ComponentType;
}

export class LazyLoadComponentFactory {

  public static getLazyComponent(importFunc: () => Promise<any>, loadingMarkup?: JSX.Element, componentNamedExport?: string) {

    // tslint:disable-next-line
    class LazyComponent extends Component<any, ILazyComponentState, any> {

      private static __COMPONENT_INSTANCE__: ComponentType;

      public state: ILazyComponentState = {
        component: LazyComponent.__COMPONENT_INSTANCE__
      };

      private mounted: boolean = false;

      public async componentWillMount(): Promise<void> {

        const RenderComponent: ComponentType = this.state.component;

        if (!RenderComponent) {
          const module: any = await importFunc();
          const ImportedRenderComponent: ComponentType = module[componentNamedExport || Object.keys(module)[0]];

          LazyComponent.__COMPONENT_INSTANCE__ = ImportedRenderComponent;

          if (this.mounted) {
            this.setState({component: ImportedRenderComponent});
          }
        }
      }

      public componentDidMount(): void {
        this.mounted = true;

        if (!this.state.component) {
          this.setState({component: LazyComponent.__COMPONENT_INSTANCE__});
        }
      }

      public componentWillUnmount(): void {
        this.mounted = false;
      }

      public render(): JSX.Element | null {
        return this.state.component ? <this.state.component {...this.props}/> : (loadingMarkup || null);
      }

    }

    return LazyComponent;
  }

}