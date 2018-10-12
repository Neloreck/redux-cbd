import * as React from "react";
import {PureComponent} from "react";
import {Action} from "redux";

// Store related things.
import {GlobalStoreConnect, IGlobalStoreState} from "../data";
import {AsyncDemoAction, SimpleDemoAction, ComplexDemoAction, DataExchangeDemoAction} from "../data/demo/actions";

// Props, that are injected from connect store.
interface IConnectedComponentStoreProps {
  demoLoading: boolean;
  demoNumber: number;
}

// Props, mapped and injected as actions creators.
interface IConnectedComponentDispatchProps {
  simpleDemoAction: (num: number) => SimpleDemoAction;
  asyncDemoAction: (num: number) => AsyncDemoAction;
  complexDemoAction: (num: number) => ComplexDemoAction;
  dataExchangeDemoAction: (num: number) => DataExchangeDemoAction;
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
@GlobalStoreConnect<IConnectedComponentStoreProps, IConnectedComponentDispatchProps, IConnectedComponentProps>(
  (store: IGlobalStoreState) => {
    return {
      demoLoading: store.demoReducer.loading,
      demoNumber: store.demoReducer.storedNumber
    };
  }, {
    simpleDemoAction: (num: number) => new SimpleDemoAction(num),
    complexDemoAction: (num: number) => new ComplexDemoAction(num),
    asyncDemoAction: (num: number) => new AsyncDemoAction(num),
    dataExchangeDemoAction: (num) => new DataExchangeDemoAction({ storedNumber: num })
  })
export class ConnectedComponent extends PureComponent<IConnectedComponentProps> {

  public static readonly actionsLog: Array<Action> = [];

  public renderLogMessages(): JSX.Element[] {
    return ConnectedComponent.actionsLog.map((item, idx) => <div key={idx}> {JSON.stringify(item)} </div>);
  }

  public render(): JSX.Element {

    const {
      someLabelFromExternalProps, simpleDemoAction, asyncDemoAction, complexDemoAction, demoLoading, demoNumber,
      dataExchangeDemoAction
    } = this.props;

    const paddingStyle = { padding: "10px" };

    return (
      <div style={paddingStyle}>

        <div> Also, check console. External prop: [{ someLabelFromExternalProps }]: </div>

        <div style={paddingStyle}>
          <b>Demo Reducer:</b> <br/> <br/>

          [testLoading]: {demoLoading.toString()} ; <br/>
          [testValue]: {demoNumber.toString()} ; <br/>
        </div>

        <br/>

        <div style={paddingStyle}>
          <button onClick={() => simpleDemoAction(Math.random())}>Send Sync Action</button>
          <button onClick={() => dataExchangeDemoAction(Math.sqrt(Math.random()))}>Send Data Exchange Action</button>
          <button onClick={() => asyncDemoAction(1000 + Math.random() * 1500)}>Send Async Action</button>
          <button onClick={() => complexDemoAction(Math.random() * 10 + 1)}>Send Complex Action</button>
        </div>

        <div>
          <h2>Actions log:</h2>
          {this.renderLogMessages()}
        </div>

      </div>
    );
  }

}
