import {SimpleAction} from "./SimpleAction";
import {EMetaData} from "../../general/type";
import {EActionClass} from "./EActionClass";

@Reflect.metadata(EMetaData.ACTION_CLASS, EActionClass.EXCHANGE_ACTION)
export abstract class DataExchangeAction<PayloadType extends object> extends SimpleAction {

  public readonly payload: PayloadType;

  constructor(payload: PayloadType) {
    super();

    this.payload = payload;
  }

}