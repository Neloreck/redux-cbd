import {DemoReducerState} from "../demo/state/DemoReducerState";

// Typing related. Interface, that includes ALL of your reducers. Other ones should be included there.
export interface IGlobalStoreState {

  demoReducer: DemoReducerState;

}
