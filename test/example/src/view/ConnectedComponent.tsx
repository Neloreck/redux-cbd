import * as React from "react";
import {Component} from "react";

import {ReduxConnect} from "../data/redux/ReduxConnect";

import {AsyncTestAction} from "../data/testReducer/actions/AsyncTestAction";
import {SyncTestAction} from "../data/testReducer/actions/SyncTestAction";

interface IConnectedComponentStoreProps {
  testValue: number;
  testLoading: boolean;
}

interface IConnectedComponentDispatchProps {
  syncTestAction: (num: number) => any;
  asyncTestAction: (num: number) => any;
}

export interface IConnectedComponentProps extends IConnectedComponentStoreProps, IConnectedComponentDispatchProps {
}

@ReduxConnect<IConnectedComponentStoreProps, IConnectedComponentDispatchProps, IConnectedComponentProps>(
  (store) => {
    return {
      testLoading: store.testReducer.testLoading,
      testValue: store.testReducer.testNumber
    };
  }, {
    syncTestAction: (num: number) => new SyncTestAction(num),
    asyncTestAction: (num: number) => new AsyncTestAction(num)
  })
export class ConnectedComponent extends Component<IConnectedComponentProps> {

  render(): JSX.Element {
    const {testLoading, testValue, syncTestAction, asyncTestAction} = this.props;

    return (
      <div>

        <h2> Simple demo: </h2>

        <div>
          <b>Test Reducer:</b> <br/>
          [testLoading]: {testLoading} ; <br/>
          [testValue]: {testValue} ; <br/>
        </div>

        <br/>

        <div>
          <button onClick={() => syncTestAction(Math.random())}>Send Sync Action</button>
          <button onClick={() => asyncTestAction(2000)}>Send Async Action</button>
        </div>

      </div>
    );
  }

}