import {SimpleAction} from "./SimpleAction";
import {EActionClass} from "./EActionClass";
import {EMetaData} from "../../general/type";

@Reflect.metadata(EMetaData.ACTION_CLASS, EActionClass.COMPLEX_ACTION)
export abstract class ComplexAction extends SimpleAction {

  // Do some complex things after dispatch based on own params.
  public abstract act(): void;

}