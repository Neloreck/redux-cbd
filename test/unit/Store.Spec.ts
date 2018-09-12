import {createReduxStore} from "./mocks/storeMocks";
import {SimpleWired} from "./mocks/actionMocks";

describe("CBD Store behaviour.", () => {

  it("Should properly create store without errors.", () => {
    const store = createReduxStore();

    expect(store).not.toBeNull();
  });

  it("Should properly handle child reducers.", () => {
    const store = createReduxStore();

    const handler = () => {
      const state = store.getState();
      expect(state.mockReducer.testString).toBe(TEST_VALUE);
    };

    store.subscribe(handler);

    let TEST_VALUE: string = "TEST_VALUE_0";
    store.dispatch(new SimpleWired(TEST_VALUE));

    TEST_VALUE += "1";
    store.dispatch(new SimpleWired(TEST_VALUE));
  });

});