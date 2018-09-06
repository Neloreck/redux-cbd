import {ActionType} from "redux-cbd";

import {AsyncReduxAction} from "../../redux/AsyncReduxAction";
import {SyncTestAction} from "./SyncTestAction";

@ActionType("ASYNC_TEST_ACTION")
export class AsyncTestAction extends AsyncReduxAction {

  public readonly payload: { loading: boolean } = {
    loading: false
  };

  public constructor(delay: number) {
    super();

    this.payload.loading = true;
    this.sendNewActionAsync(delay);
  }

  private sendNewActionAsync(delay: number): void {
    new Promise((resolve) => setTimeout(resolve, delay))
    .then(() => this.dispatch(new SyncTestAction(Math.random())));
  }

}