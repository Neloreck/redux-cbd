import * as React from "react";
import {PureComponent} from "react";
import {Action} from "redux";

// Store related things.
import {withGlobalStoreConnection, IGlobalStoreState} from "../data/redux";
import {AsyncDemoAction, SimpleDemoAction, ComplexDemoAction} from "../data/demo/actions";

/*
 * Connected component example.
 * Second param of decorator is optional. If you need actions only, leave first param as empty arrow func.
 */

// Props, that are injected from connect store.
interface IConnectedComponentStoreProps {
  demoLoading: boolean;
  demoNumber: number;
}

// Props, mapped and injected as actions creators.
interface IConnectedComponentDispatchProps {
  simpleDemoAction: (num: number) => any;
  asyncDemoAction: (num: number) => any;
  complexDemoAction: (num: number) => any;
}

// Own props, that are passed with manual component/container creations.
// Router-managed components are not so complicated because we don't create them manually.
export interface IConnectedComponentOwnProps {
  someLabelFromExternalProps: string;
}

// External props, that are injected by different decorators.
// For example: @Connect, @withStyles (material ui), @withWrapper (provide some props with HOC by decorator usage) etc.
export interface IConnectedComponentExternalProps extends IConnectedComponentStoreProps,
  IConnectedComponentDispatchProps {}

// General props for whole component for overall picture, everything can be accessed from the inside.
export interface IConnectedComponentProps extends IConnectedComponentOwnProps, IConnectedComponentExternalProps {}

// Link global store provider with component. This props will be injected automatically and should be type safe.
@withGlobalStoreConnection<IConnectedComponentStoreProps, IConnectedComponentDispatchProps, IConnectedComponentProps>(
  // State is strict-typed there. Props are injected directly from state. We can use selectors there.
  // Also, we can add some types of simple selectors into this lib (PRs and ideas are welcome, just follow the style).
  (store: IGlobalStoreState) => {
    return {
      demoLoading: store.demoReducer.loading,
      demoNumber: store.demoReducer.storedNumber
    };
  }, {
    // Returned values will be dispatched. Mapping params to actions creation and store dispatch.
    simpleDemoAction: (num: number) => new SimpleDemoAction(num),
    complexDemoAction: (num: number) => new ComplexDemoAction(num),
    asyncDemoAction: (num: number) => new AsyncDemoAction(num)
  })
// Stateless component, but second template param can be supplied for stateful ones. Third type is context.
export class ConnectedComponent extends PureComponent<IConnectedComponentProps> {

  // Array for logging of redux actions. Just for demo purposes. Static is not best solutions for prod.
  public static readonly actionsLog: Array<Action> = [];

  // Rendering array of log messages.
  public renderLog(): JSX.Element[] {
    return ConnectedComponent.actionsLog.map((item, idx) => <div key={idx}> {JSON.stringify(item)} </div>);
  }

  public render(): JSX.Element {

    const {
      someLabelFromExternalProps, simpleDemoAction, asyncDemoAction, complexDemoAction, demoLoading, demoNumber
    } = this.props;

    const paddingStyle = { padding: "10px" };

    return (
      <div style={paddingStyle}>

        <h2> Simple demo [{ someLabelFromExternalProps }]: </h2>

        <div style={paddingStyle}>
          <b>Demo Reducer:</b> <br/> <br/>

          [testLoading]: {demoLoading.toString()} ; <br/>
          [testValue]: {demoNumber.toString()} ; <br/>
        </div>

        <br/>

        <div style={paddingStyle}>
          <button onClick={() => simpleDemoAction(Math.random())}>Send Sync Action</button>
          <button onClick={() => asyncDemoAction(1000 + Math.random() * 1500)}>Send Async Action</button>
          <button onClick={() => complexDemoAction(Math.random() * 10 + 1)}>Send Complex Action</button>
        </div>

        <div>
          <h2>Actions log:</h2>
          {this.renderLog()}
        </div>

      </div>
    );
  }

}
