import * as React from "react";
import {Consumer, Context, createContext} from "react";

/*
 * Current Issue: Static items inside of each class instance.
 */

export abstract class ReactContextManager<T extends object> {

  private readonly providedContext: Context<T>;
  protected observedElements: Array<any> = [];
  protected abstract context: T;

  public constructor() {
    this.providedContext = createContext(this.getProvidedProps());
  }

  public getConsumer(): Consumer<T> {
    return this.providedContext.Consumer;
  }

  public getProvider() {

    const self = this;

    return class extends React.PureComponent {

      public componentWillMount(): void {
        self.observedElements.push(this);
      }

      public componentWillUnmount(): void {
        self.observedElements = self.observedElements.filter((it) => it !== this);
      }

      public render(): JSX.Element {
        return React.createElement(self.providedContext.Provider,  { value: self.getProvidedProps() }, this.props.children);
      }
    };
  }

  public update(): void {
    this.beforeUpdate();
    this.observedElements.forEach((it) => it.forceUpdate());
    this.afterUpdate();
  }

  protected beforeUpdate(): void {}
  protected afterUpdate(): void {}


  private getProvidedProps(): T {
    // @ts-ignore
    return { ...this.context };
  }

}
