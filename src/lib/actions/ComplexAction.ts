import {SimpleAction} from "./SimpleAction";
import {EActionType} from "./EActionType";

export abstract class ComplexAction extends SimpleAction {

  public static readonly _internalType: EActionType = EActionType.COMPLEX_ACTION;

  public constructor() {
    super();
  }

  // Do some complex things after dispatch based on own params.
  public abstract act(): void;

}