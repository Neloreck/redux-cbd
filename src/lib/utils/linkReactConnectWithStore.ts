import {
  connect as originalConnect, ConnectOptions, MapStateToPropsParam, MapDispatchToPropsParam, MergeProps
} from "react-redux";

import {IReactComponentConnect} from "./IReactComponentConnect";


export function linkReactConnectWithStore<T>(storeKey: string): IReactComponentConnect<T>  {

  const newConnect = (mapStateToProps: MapStateToPropsParam<any, any, any>,
                      mapDispatchToProps: MapDispatchToPropsParam<any, any>,
                      mergeProps: MergeProps<any, any, any, any>,
                      options: ConnectOptions) => {

    options.storeKey = storeKey;

    return originalConnect(mapStateToProps, mapDispatchToProps, mergeProps, options);
  };

  return newConnect as IReactComponentConnect<T>;

}
