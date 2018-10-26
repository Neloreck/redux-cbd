import {EActionClass, EMetaData} from "../../src";
import {
  ASYNC_ACTION,
  AsyncActionExample,
  COMPLEX_ACTION,
  ComplexActionExample,
  SIMPLE_ACTION,
  SimpleActionExample
} from "./mocks/actionMocks";

describe("CBD Actions.", () => {

  it("Should properly handle action internal and wired types.", () => {

    const simpleAction: SimpleActionExample = new SimpleActionExample("Anything.");
    expect(simpleAction.getActionType()).toBe(SIMPLE_ACTION);
    expect(simpleAction.getActionPayload()).toBe(simpleAction.payload);

    const complexAction: ComplexActionExample = new ComplexActionExample(5);
    expect(complexAction.getActionType()).toBe(COMPLEX_ACTION);
    expect(complexAction.getActionPayload()).toBe(complexAction.payload);

    const asyncAction: AsyncActionExample = new AsyncActionExample();
    expect(asyncAction.getActionType()).toBe(ASYNC_ACTION);
    expect(asyncAction.getActionPayload()).toBe(asyncAction.payload);

    expect(Reflect.getMetadata(EMetaData.ACTION_CLASS, SimpleActionExample)).toBe(EActionClass.SIMPLE_ACTION);
    expect(Reflect.getMetadata(EMetaData.ACTION_CLASS, ComplexActionExample)).toBe(EActionClass.COMPLEX_ACTION);
    expect(Reflect.getMetadata(EMetaData.ACTION_CLASS, AsyncActionExample)).toBe(EActionClass.ASYNC_ACTION);

    expect(Reflect.getMetadata(EMetaData.ACTION_TYPE, SimpleActionExample)).toBe(undefined);
    expect(Reflect.getMetadata(EMetaData.ACTION_TYPE, ComplexActionExample)).toBe(COMPLEX_ACTION);
    expect(Reflect.getMetadata(EMetaData.ACTION_TYPE, AsyncActionExample)).toBe(ASYNC_ACTION);

    expect(simpleAction.getActionType()).toBe(SIMPLE_ACTION);
    expect(complexAction.getActionType()).toBe(Reflect.getMetadata(EMetaData.ACTION_TYPE, ComplexActionExample));
    expect(asyncAction.getActionType()).toBe(Reflect.getMetadata(EMetaData.ACTION_TYPE, AsyncActionExample));
  });

  it("Should properly handle complex actions execution.", () => {

    const VALUE_FOR_TEST: number = 5;
    const complexWiredAction: ComplexActionExample = new ComplexActionExample(VALUE_FOR_TEST);

    expect(complexWiredAction.payload.value).not.toBe(VALUE_FOR_TEST);
    expect(complexWiredAction.payload.value).not.toBe(VALUE_FOR_TEST * 2);

    complexWiredAction.act();

    expect(complexWiredAction.payload.value).toBe(VALUE_FOR_TEST * 2);
  });

  it("Should properly handle async actions execution.", async () => {

    const asyncActionWithThrow: AsyncActionExample = new AsyncActionExample(true);
    const exceptionInTryBlockMessage: string = "Manual exception in try.";

    try {
      await asyncActionWithThrow.act();
      throw new Error(exceptionInTryBlockMessage);
    } catch (error) {
      expect(error.message).not.toBe(exceptionInTryBlockMessage);
    }

    const asyncActionWithoutThrow: AsyncActionExample = new AsyncActionExample(false);

    // Like middleware does.
    const resultingValue: string = await asyncActionWithoutThrow.act();
    const afterSuccessValue: string = asyncActionWithoutThrow.afterSuccess(resultingValue).payload.value;

    expect(afterSuccessValue).toBe("Success.");
  });

});