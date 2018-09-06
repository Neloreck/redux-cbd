import * as React from "react";
import {MapDispatchToPropsParam, MapStateToPropsParam, MergeProps, Options} from "react-redux";

export type InferableComponentEnhancerWithProps<IInjectedProps, INeedsProps> =
<IComponent extends React.ComponentType<IInjectedProps & INeedsProps>>(component: IComponent) => IComponent;

export interface IReactComponentConnect<T> {
  <IStateProps = {}, IDispatchProps = {}, IOwnProps = {}>(
  mapStateToProps?: MapStateToPropsParam<IStateProps, IOwnProps, T>,
  mapDispatchToProps?: MapDispatchToPropsParam<IDispatchProps, IOwnProps>,
  ): InferableComponentEnhancerWithProps<IStateProps & IDispatchProps, IOwnProps>;

  <IStateProps = {}, IDispatchProps = {}, IOwnProps = {}, IMergedProps = {}>(
  mapStateToProps?: MapStateToPropsParam<IStateProps, IOwnProps, T>,
  mapDispatchToProps?: MapDispatchToPropsParam<IDispatchProps, IOwnProps>,
  mergeProps?: MergeProps<IStateProps, IDispatchProps, IOwnProps, IMergedProps>,
  options?: Options<IStateProps, IOwnProps, IMergedProps>,
  ): InferableComponentEnhancerWithProps<IMergedProps, IOwnProps>;
}
