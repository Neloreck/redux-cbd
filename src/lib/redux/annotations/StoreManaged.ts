import {Constructor, EMetaData} from "../../general/type";
import {Single} from "../../general/annotations";

export const StoreManaged = (storeKey: string): ((constructor: any) => any) => {

   return function StoreManager<T extends Constructor<{}>>(constructor: T): any {

     Reflect.defineMetadata(EMetaData.STORE_MANAGED, true, constructor);
     Reflect.defineMetadata(EMetaData.STORE_KEY, storeKey, constructor);

     return Single(constructor);
  };
};
