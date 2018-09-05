import * as React from "react";
import {Component} from "react";

import {ReduxConnect} from "../data/lib";

import {AsyncTestAction} from "../data/testReducer/actions/AsyncTestAction";
import {SyncTestAction} from "../data/testReducer/actions/SyncTestAction";

interface IConnectedComponentStoreProps {
  testValue: number;
}

interface IConnectedComponentDispatchProps {
  syncTestAction: (num: number) => any;
  asyncTestAction: (num: number) => any;
}

interface IConnectedComponentProps extends IConnectedComponentStoreProps, IConnectedComponentDispatchProps{
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
    return (
      <div>
        Test.
      </div>
    );
  }

}