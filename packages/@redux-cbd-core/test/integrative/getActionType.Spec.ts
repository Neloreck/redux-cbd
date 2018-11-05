import {getActionType} from "../../src";
import {
  ActionsBundle,
  FUNCTIONAL_ACTION,
  SIMPLE_ACTION,
  SimpleActionExample
} from "../mocks/actionMocks";


describe("CBD Actions.", () => {

  it("Should properly get action types.", () => {

    const GENERIC_TYPE: string = "generic";

    expect(getActionType({ type: GENERIC_TYPE })).toBe(GENERIC_TYPE);
    expect(getActionType(ActionsBundle.multiply)).toBe(FUNCTIONAL_ACTION);

    expect(getActionType(new SimpleActionExample(""))).toBe(SIMPLE_ACTION);
    expect(getActionType(SimpleActionExample.prototype)).toBe(SIMPLE_ACTION);

    expect(SimpleActionExample.getActionType()).toBe(SIMPLE_ACTION);
    expect(getActionType(SimpleActionExample.prototype)).toBe(SimpleActionExample.getActionType());
    expect(getActionType(new SimpleActionExample(""))).toBe(new SimpleActionExample("").getActionType());


    expect(getActionType({} as any)).toBe(undefined);
    expect(getActionType(1 as any)).toBe(undefined);
    expect(getActionType("2" as any)).toBe(undefined);
    expect(getActionType((() => 2)  as any)).toBe(undefined);

  });

});