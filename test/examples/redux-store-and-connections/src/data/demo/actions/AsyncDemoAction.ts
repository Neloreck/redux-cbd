import {ActionWired, AsyncAction} from "redux-cbd";

import {AsyncDemoActionSuccess} from "./AsyncDemoActionSuccess";

// Async action. Sets loading true and dispatches success action after delay. Just like fetch\axios request.
@ActionWired("ASYNC_TEST_ACTION")
export class AsyncDemoAction extends AsyncAction {

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
    const forMillis = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

    await forMillis(this.delay);
    return Math.random();
  }

  public afterSuccess(num: number): AsyncDemoActionSuccess {
    return new AsyncDemoActionSuccess(num);
  }

  /*  public afterError(error: Error) { return new .......... } */

}