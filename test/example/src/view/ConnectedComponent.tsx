import * as React from "react";
import {Component} from "react";
import {Action} from "redux";

import {GlobalReduxConnect} from "../data/redux/ReduxConnect";
import {IReduxStoreState} from "../data/redux/IReduxStoreState";

import {AsyncDemoAction, SimpleDemoAction, ComplexDemoAction} from "../data/demo/actions";

/*
 * Connected component example.
 * IConnectedComponentStoreProps --> Props, injected from store state.
 * IConnectedComponentStoreProps --> Actions, based on second connect parameters.
 * IConnectedComponentProps --> Composite props, can get some additional props from other components there.
 *
 * Second param of decorator is optional. If you need actions only, leave first param as empty arrow func.
 */

interface IConnectedComponentStoreProps {
  demoLoading: boolean;
  demoNumber: number;
}

interface IConnectedComponentDispatchProps {
  simpleDemoAction: (num: number) => any;
  asyncDemoAction: (num: number) => any;
  complexDemoAction: (num: number) => any;
}

export interface IConnectedComponentExternalProps extends IConnectedComponentStoreProps, IConnectedComponentDispatchProps {
}

export interface IConnectedComponentInternalProps {
}

export interface IConnectedComponentProps extends IConnectedComponentInternalProps, IConnectedComponentExternalProps {
}

@GlobalReduxConnect<IConnectedComponentStoreProps, IConnectedComponentDispatchProps, IConnectedComponentProps>(
  // State is strict-typed there.
  (store: IReduxStoreState) => {
    return {
      demoLoading: store.demoReducer.loading,
      demoNumber: store.demoReducer.storedNumber
    };
  }, {
    // Returned value will be dispatched.
    simpleDemoAction: (num: number) => new SimpleDemoAction(num),
    complexDemoAction: (num: number) => new ComplexDemoAction(num),
    asyncDemoAction: (num: number) => new AsyncDemoAction(num)
  })
export class ConnectedComponent extends Component<IConnectedComponentProps> {

  public static readonly actionsLog: Array<Action> = [];

  public renderLog(): JSX.Element[] {
    return ConnectedComponent.actionsLog.map((item, idx) => <div key={idx}> {JSON.stringify(item)} </div>);
  }

  public render(): JSX.Element {
    const {simpleDemoAction, asyncDemoAction, complexDemoAction, demoLoading, demoNumber} = this.props;
    const paddingStyle = { padding: "10px" };

    return (
      <div style={paddingStyle}>

        <h2> Simple demo: </h2>

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
