import {Action, Reducer} from "redux";
import {MockReducer, MockReducerState} from "./mocks/reducerMocks";
import {SimpleWired} from "./mocks/actionMocks";

const mockReducer: MockReducer = new MockReducer();
const mockReducerFunctional: Reducer<MockReducerState, { type: string, payload?: any }> = mockReducer.asFunctional(new MockReducerState(), { freezeState: true });

describe("CBD Reducer behaviour.", () => {

  it("Should properly handle declared action.", () => {

    const SIMPLE_TEST_VALUE: string = "test";

    const action = new SimpleWired(SIMPLE_TEST_VALUE);

    const state = mockReducerFunctional(undefined, { type: action.getActionType(), payload: action.getActionPayload() });

    expect(state.testString).toBe(SIMPLE_TEST_VALUE);
  });

  it("Should ignore odd(not declared handlers) actions. Default state should be generated properly.", () => {

    const defaultState: MockReducerState = new MockReducerState();
    const state = mockReducerFunctional(undefined, { type: "ODD_ACTION" });

    expect(Object.keys(defaultState)).toHaveLength(Object.keys(state).length);

    for (const key in defaultState) {
      expect(defaultState[key]).toBe(state[key]);
    }

  });



});