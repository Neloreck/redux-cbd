import {connect as originalConnect} from "react-redux";
import {IReactComponentConnect} from "./IReactComponentConnect";

export function linkReactConnectWithStore<T>() {
  return originalConnect as IReactComponentConnect<T>;
}