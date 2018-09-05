import {Action} from "redux";

export abstract class SyncReduxAction implements Action {

  public static readonly type: string;
  public readonly type: string;

  public constructor() {
    this.type = this.getActionType();
  }

  public getActionType(): string {
    return Object.getPrototypeOf(this).type;
  }

}