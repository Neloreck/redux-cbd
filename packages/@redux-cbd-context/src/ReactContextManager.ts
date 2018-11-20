import * as React from "react";
import {Consumer, Context, createContext} from "react";

export abstract class ReactContextManager<T extends object> {

  protected readonly providedContext: Context<T>;
  protected observedElements: Array<any> = [];
  protected abstract state: T;

  public constructor() {
    this.providedContext = createContext(this.getProvidedProps());
  }

  public update(): void {
    this.observedElements.forEach((it) => it.forceUpdate());
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

  protected getProvidedProps(): T {
    // @ts-ignore
    return { ...this.state };
  }

}
