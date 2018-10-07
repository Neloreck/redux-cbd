import {EMetaData} from "../../general/type";

// Runtime assertion.
export const ActionHandler = <T>(instance: T, method: string, descriptor: PropertyDescriptor) => {

  const secondParam = Reflect.getMetadata(EMetaData.PARAM_TYPES, instance, method)[1];

  if (!secondParam || !Reflect.getMetadata(EMetaData.ACTION_TYPE, secondParam)) {
    throw new Error(`Wrong second action handler param provided for handling. Reducer: ${instance.constructor.name}, ` +
      `method: ${method}, paramType: ${secondParam && secondParam.name || secondParam}.`);
  }

};
