import {ActionWired, ComplexAction} from "redux-cbd";

// Action with delayed execution. If you do not like doing everything directly in constructor.
// Will be executed directly by redux cbd middleware. Note this.
@ActionWired("COMPLEX_DEMO_ACTION")
export class ComplexDemoAction extends ComplexAction {

  public payload: { storedNumber: number } = { storedNumber: 0 };

  public constructor(num: number) {
    super();

    this.payload.storedNumber = num;
  }

  public act(): void {
    this.payload.storedNumber *= 1000 + 500 * Math.random();
  }

}
