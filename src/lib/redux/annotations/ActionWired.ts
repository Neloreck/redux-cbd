import {EMetaData} from "../../general/type";

export const ActionWired = (actionType: string): ((target: any) => any) => {
  return (constructor: (...args: Array<any>) => any ) => {
    Reflect.defineMetadata(EMetaData.ACTION_TYPE, actionType, constructor);
  };
};
