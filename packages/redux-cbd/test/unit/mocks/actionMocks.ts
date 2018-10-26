import {ActionWired, SimpleAction, ComplexAction, AsyncAction, DataExchangeAction} from "../../../src";

export const SIMPLE_ACTION: string = "SIMPLE_ACTION";
export const COMPLEX_ACTION: string = "COMPLEX_ACTION";
export const ASYNC_ACTION: string = "ASYNC_WIRED";
export const EXCHANGE_ACTION: string = "EXCHANGE_ACTION";
export const ACTION_FROM_OUTSIDE: string = "ACTION_FROM_OUTSIDE";

// Overloading method instead of decorator usage.
export class SimpleActionExample extends SimpleAction {

  public payload: { value: string } = { value: "" };

  constructor(newValue: string) {
    super();
    this.payload.value = newValue;
  }

  public getActionType(): string {
    return SIMPLE_ACTION;
  }

}

@ActionWired(ASYNC_ACTION)
export class AsyncActionExample extends AsyncAction<never> {

  private readonly throwException: boolean = false;

  constructor(throwException: boolean = false) {
    super();

    this.throwException = throwException;
  }

  public async act(): Promise<string> {

    if (this.throwException) {
      throw new Error("Error.");
    }

    return "Success.";
  };

  public afterSuccess(str: string): SimpleActionExample {
    return new SimpleActionExample(str);
  }

}

@ActionWired(COMPLEX_ACTION)
export class ComplexActionExample extends ComplexAction<never> {

  public readonly payload: { value: number } = { value: 0 };

  private readonly receivedValue: number;

  public constructor(newValue: number) {
    super();

    this.receivedValue = newValue;
  }

  public act(): void {
    this.payload.value = this.receivedValue * 2;
  };

}

@ActionWired(EXCHANGE_ACTION)
export class ExchangeActionExample extends DataExchangeAction<{ value: string }> {}
