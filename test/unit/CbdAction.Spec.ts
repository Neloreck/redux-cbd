import {ASYNC_SUCCESS, COMPLEX_MANUAL, ASYNC_MANUAL, COMPLEX_WIRED, SIMPLE_MANUAL, ASYNC_WIRED,
  SIMPLE_WIRED, SimpleWired, SimpleManual, AsyncWired, AsyncManual, ComplexWired, ComplexManual} from "./mocks/actionMocks";

import {EActionClass} from "../../src@bundled";
import {EMetaData} from "../../src/lib/general/type";

describe("CBD Actions.", () => {

  it("Should properly handle action internal and wired types.", () => {

    // Simple.

    const simpleWired: SimpleWired = new SimpleWired("anything");
    const simpleManual: SimpleManual = new SimpleManual();

    expect(simpleWired.getActionType()).toBe(SIMPLE_WIRED);
    expect(simpleManual.getActionType()).toBe(SIMPLE_MANUAL);

    expect(Reflect.getMetadata(EMetaData.ACTION_CLASS, SimpleWired)).toBe(EActionClass.SIMPLE_ACTION);
    expect(Reflect.getMetadata(EMetaData.ACTION_CLASS, SimpleManual)).toBe(EActionClass.SIMPLE_ACTION);

    // Complex.

    const complexWired: ComplexWired = new ComplexWired("anything");
    const complexManual: ComplexManual = new ComplexManual();

    expect(complexWired.getActionType()).toBe(COMPLEX_WIRED);
    expect(complexManual.getActionType()).toBe(COMPLEX_MANUAL);

    expect(Reflect.getMetadata(EMetaData.ACTION_CLASS, ComplexWired)).toBe(EActionClass.COMPLEX_ACTION);
    expect(Reflect.getMetadata(EMetaData.ACTION_CLASS, ComplexManual)).toBe(EActionClass.COMPLEX_ACTION);

    // Async.

    const asyncWired: AsyncWired = new AsyncWired();
    const asyncManual: AsyncManual = new AsyncManual();

    expect(asyncWired.getActionType()).toBe(ASYNC_WIRED);
    expect(asyncManual.getActionType()).toBe(ASYNC_MANUAL);

    expect(Reflect.getMetadata(EMetaData.ACTION_CLASS, AsyncWired)).toBe(EActionClass.ASYNC_ACTION);
    expect(Reflect.getMetadata(EMetaData.ACTION_CLASS, AsyncManual)).toBe(EActionClass.ASYNC_ACTION);

  });

  it("Should properly handle complex actions execution", () => {

    const VALUE_FOR_TEST: string = "VALUE_FOR_TEST";

    const complexWiredAction: ComplexWired = new ComplexWired(VALUE_FOR_TEST);
    complexWiredAction.act();

    expect(complexWiredAction.payload.value).toBe(VALUE_FOR_TEST);

  });

  it("Should properly handle async actions execution", async () => {

    const asyncManualAction: AsyncManual = new AsyncManual();
    const asyncWiredAction: AsyncWired = new AsyncWired();

    try {
      await asyncManualAction.act();
      throw new Error("Manual error.");
    } catch (error) {
      expect(error.message).not.toBe("Manual error.");
    }

    const resultingValue: string = await asyncWiredAction.act();
    const afterSuccessValue: string = asyncWiredAction.afterSuccess(resultingValue).payload.value;

    expect(afterSuccessValue).toBe(ASYNC_SUCCESS);
  });

});