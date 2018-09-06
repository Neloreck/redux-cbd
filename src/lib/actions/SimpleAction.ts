import {Action} from "redux";
import {EActionType} from "./EActionType";

export abstract class SimpleAction implements Action {

  public static readonly _internalType: EActionType = EActionType.SIMPLE_ACTION;
  public static readonly type: string;

  public static getInternalType(): EActionType {
    return this._internalType;
  }

  public readonly type: string;
  protected payload: object = {};

  public constructor() {
      this.type = this.getActionType();
  }

  public getActionPayload(): object {
    return this.payload;
  }

  public getActionType(): string {
    return Object.getPrototypeOf(this).type;
  }

}