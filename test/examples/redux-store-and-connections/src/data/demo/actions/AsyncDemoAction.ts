import {ActionWired, AsyncAction} from "redux-cbd";

import {AsyncDemoActionSuccess} from "./AsyncDemoActionSuccess";
import {DemoState} from "../DemoState";

// Async action. Sets loading true and dispatches success action after delay. Just like fetch\axios request.
@ActionWired("ASYNC_TEST_ACTION")
export class AsyncDemoAction extends AsyncAction<DemoState> {

  public readonly payload: {
    loading: boolean
  } = {
    loading: true
  };

  private readonly delay: number;

  public constructor(delay: number) {
    super();

    this.payload.loading = true;
    this.delay = delay;
  }

  public async act(): Promise<number> {
    console.info("[ASYNC ACT] STATE CONTEXT:", this.getCurrentState());

    const forMillis = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

    await forMillis(this.delay);
    return Math.random();
  }

  public afterSuccess(num: number): AsyncDemoActionSuccess {
    console.info("[ASYNC SUCCESS] STATE CONTEXT:", this.getCurrentState());
    return new AsyncDemoActionSuccess(num);
  }

  /*  public afterError(error: Error) { return new .......... } */

}