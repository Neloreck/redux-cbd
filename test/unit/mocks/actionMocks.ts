import {ActionWired, SimpleAction, ComplexAction, AsyncAction} from "../../../src";
import {IStoreState} from "./storeMocks";

// Simple actions.

export const SIMPLE_WIRED: string = "SIMPLE_WIRED";
export const SIMPLE_MANUAL: string = "SIMPLE_MANUAL";

@ActionWired(SIMPLE_WIRED)
export class SimpleWired extends SimpleAction {

  public payload: { value: string } = { value: "" };

  constructor(newValue: string) {
    super();

    this.payload.value = newValue;
  }

}

export class SimpleManual extends SimpleAction {

  public getActionType(): string {
    return SIMPLE_MANUAL;
  }

}

// Complex actions.

export const COMPLEX_WIRED: string = "COMPLEX_WIRED";
export const COMPLEX_MANUAL: string = "COMPLEX_MANUAL";

@ActionWired(COMPLEX_WIRED)
export class ComplexWired extends ComplexAction<IStoreState> {

  public readonly payload: { value: string } = { value: "" };

  private readonly receivedValue: string;

  public constructor(newValue: string) {
    super();

    this.receivedValue = newValue;
  }

  public act(): void {
    this.payload.value = this.receivedValue;
  };

}

export class ComplexManual extends ComplexAction<IStoreState> {

  public getActionType(): string {
    return COMPLEX_MANUAL;
  }

  public act(): void {};

}

// Async actions.

export const ASYNC_WIRED: string = "ASYNC_WIRED";
export const ASYNC_MANUAL: string = "ASYNC_MANUAL";
export const ASYNC_SUCCESS: string = "ASYNC_SUCCESS";

@ActionWired(ASYNC_WIRED)
export class AsyncWired extends AsyncAction<IStoreState> {

  public async act(): Promise<string> {
    return ASYNC_SUCCESS;
  };

  public afterSuccess(str: string): SimpleWired {
    return new SimpleWired(str);
  }

}

export class AsyncManual extends AsyncAction<IStoreState> {

  public getActionType(): string {
    return ASYNC_MANUAL;
  }

  public async act(): Promise<string> {

    throw new Error("Synthetic error.");
  };

  public afterSuccess(str: string): SimpleWired {
    return new SimpleWired(str);
  }

}
