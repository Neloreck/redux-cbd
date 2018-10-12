import {Action} from "redux";

import {EActionClass} from "./EActionClass";
import {EMetaData} from "../../general/type";

@Reflect.metadata(EMetaData.ACTION_CLASS, EActionClass.SIMPLE_ACTION)
export abstract class SimpleAction implements Action {

  public type!: string;

  public readonly payload: object = {};

  public getActionPayload(): object {
    return this.payload;
  }

  public getActionType(): string {
    return Reflect.getMetadata(EMetaData.ACTION_TYPE, this.constructor);
  }

}