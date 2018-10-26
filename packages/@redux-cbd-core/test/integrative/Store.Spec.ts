import {Action, Store, createStore} from "redux";
import {IStoreState, STORE_KEY, TestStoreManager, testStoreManager} from "../mocks/storeMocks";
import {MockReducerState} from "../mocks/reducerMocks";
import {
  ACTION_FROM_OUTSIDE,
  AsyncActionExample,
  ComplexActionExample,
  ExchangeActionExample,
  SimpleActionExample
} from "../mocks/actionMocks";
import {CBDStoreManager, EMetaData, StoreManaged} from "../../src";

describe("CBD Store behaviour.", () => {

  it("Should properly create store without errors.", () => {
    const store = testStoreManager.createStore();
    expect(store).not.toBeNull();
  });

  it("Should properly handle child reducers.", () => {
    const store = testStoreManager.createStore();

    const handler = () => {
      const state = store.getState();
      expect(state.mockReducer.testString).toBe(TEST_VALUE);
    };

    store.subscribe(handler);

    let TEST_VALUE: string = "TEST_VALUE_0";
    store.dispatch(new SimpleActionExample(TEST_VALUE));

    TEST_VALUE += "1";
    store.dispatch(new ExchangeActionExample({ value: TEST_VALUE }));
  });

  it("Should create only one store for all manager instances.", () => {

    const firstStore = testStoreManager.getStore();
    const secondStore = new TestStoreManager().getStore();

    const handler = () => {

      const firstState = firstStore.getState();
      const secondState = secondStore.getState();

      expect(firstState.mockReducer.testString).toBe(TEST_VALUE);
      expect(firstState.mockReducer.testString).toBe(secondState.mockReducer.testString);
    };

    firstStore.subscribe(handler);

    let TEST_VALUE: string = "TEST_VALUE_0";
    firstStore.dispatch(new ExchangeActionExample({ value: TEST_VALUE }));

    TEST_VALUE += Math.random() * 1000;
    secondStore.dispatch(new ExchangeActionExample({ value: TEST_VALUE }));

    TEST_VALUE += Math.random() * 1000;
    firstStore.dispatch(new SimpleActionExample(TEST_VALUE));
  });

  it("Should provide correct store key.", () => {
    expect(testStoreManager.getStoreKey()).toBe(STORE_KEY);
  });

  it("Should correctly init reducer state classes.", () => {

    const mockReducerState: MockReducerState = testStoreManager.createStore().getState().mockReducer;
    const newMockState: MockReducerState = new MockReducerState();

    expect(mockReducerState).toBeInstanceOf(MockReducerState);

    for (const key in mockReducerState) {
     expect(mockReducerState[key]).toBe(newMockState[key]);
    }
  });

  it("Should work properly with dispatch different from declared cbd actions.", () => {

    const store: Store<IStoreState, Action<any>> = testStoreManager.createStore();

    store.dispatch({ type: "Random action." });
    store.dispatch(new SimpleActionExample("Random string."));
    store.dispatch({ type: "Random action." });
    store.dispatch(new ComplexActionExample(25));
    store.dispatch(new AsyncActionExample());
    store.dispatch(new ExchangeActionExample({ value: "Something else."}))
  });

  it("Should handle actions from other packages and modules.", () => {

    const SIMPLE_TEST_VALUE: string = "SIMPLE-TEST-VALUE";
    const store: Store<IStoreState, Action<any>> = testStoreManager.createStore();

    expect(store.getState().mockReducer.testString).toBe(new MockReducerState().testString);

    // Like others do, simple object dispatch for redux.
    store.dispatch({ type: ACTION_FROM_OUTSIDE, payload: { value: SIMPLE_TEST_VALUE }});

    expect(store.getState().mockReducer.testString).toBe(SIMPLE_TEST_VALUE);
  });

  it("Should work only with store managed decorated managers.", () => {

   class Manager extends CBDStoreManager<{}> {

      protected createStore() {
        return createStore(() => ({}))
      }

    }

    const preparedError = new Error("Prepared error.");

    try {
      const manager = new Manager();
      throw preparedError;
    } catch (error) {
      expect(error).not.toBe(preparedError);
      expect(error.message).toBe("You should annotate your store manager with @StoreManaged for usage.");
    }

    @StoreManaged()
    class AnnotatedManager extends CBDStoreManager<{}> {

      protected createStore() {
        return createStore(() => ({}))
      }

    }

    const manager = new AnnotatedManager();

    expect(Reflect.getMetadata(EMetaData.STORE_KEY, AnnotatedManager)).toBe(undefined);
    expect(manager.getStoreKey()).toBe("store");

    const STORE_KEY = "STORE_KEY";

    @StoreManaged(STORE_KEY)
    class AnnotatedKeyManager extends CBDStoreManager<{}> {

      protected createStore() {
        return createStore(() => ({}))
      }

    }

    const managerWithKey = new AnnotatedKeyManager();

    expect(Reflect.getMetadata(EMetaData.STORE_KEY, managerWithKey.constructor)).toBe(STORE_KEY);
    expect(managerWithKey.getStoreKey()).toBe(STORE_KEY);
  });

});