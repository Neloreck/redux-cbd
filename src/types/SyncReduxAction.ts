import {Action} from "redux";

export abstract class SyncReduxAction implements Action {

  private static readonly type: string;
  public readonly type: string;

  public constructor() {
    this.type = this.getActionType();
  }

  protected getActionType(): string {
    return Object.getPrototypeOf(this).type;
  }

}