import * as React from "react";
import {PureComponent} from "react";
import {Action} from "redux";
import {Bind} from "redux-cbd";

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
  sendSimpleDemoAction: (num: number) => SimpleDemoAction;
  sendAsyncDemoAction: (num: number) => AsyncDemoAction;
  sendComplexDemoAction: (num: number) => ComplexDemoAction;
  sendDataExchangeDemoAction: (num: number) => DataExchangeDemoAction;
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
    sendSimpleDemoAction: (num: number) => new SimpleDemoAction(num),
    sendComplexDemoAction: (num: number) => new ComplexDemoAction(num),
    sendAsyncDemoAction: (num: number) => new AsyncDemoAction(num),
    sendDataExchangeDemoAction: (num) => new DataExchangeDemoAction({ storedNumber: num })
  })
export class ConnectedComponent extends PureComponent<IConnectedComponentProps> {

  public static actionsLog: Array<Action> = [];

  public renderLogMessages(): JSX.Element[] {
    return ConnectedComponent.actionsLog.map((item, idx) => <div key={idx}> {JSON.stringify(item)} </div>);
  }

  public render(): JSX.Element {

    const {someLabelFromExternalProps, demoLoading, demoNumber} = this.props;
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
          <button onClick={this.sendSimpleDemoAction}>Send Sync Action</button>
          <button onClick={this.sendDataExchangeAction}>Send Data Exchange Action</button>
          <button onClick={this.sendAsyncAction}>Send Async Action</button>
          <button onClick={this.sendComplexAction}>Send Complex Action</button>
          <button onClick={this.clearLogMessages}>Clean</button>
        </div>

        <div>
          <div>Actions log:</div>
          {this.renderLogMessages()}
        </div>

      </div>
    );
  }

  @Bind
  public clearLogMessages(): void {
    ConnectedComponent.actionsLog = [];
    this.forceUpdate();
  }

  @Bind
  private sendSimpleDemoAction(): void {
    this.props.sendSimpleDemoAction(Math.random() * 999 + 1);
  }

  @Bind
  private sendDataExchangeAction(): void {
    this.props.sendDataExchangeDemoAction(Math.random() * 9999 + 1000)
  }

  @Bind
  private sendComplexAction(): void {
    this.props.sendComplexDemoAction(Math.random() * -9999 - 1)
  }

  @Bind
  private sendAsyncAction(): void {
    this.props.sendComplexDemoAction(Math.random() * -99999 - 10000)
  }

}
