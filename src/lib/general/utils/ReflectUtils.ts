import {EMetaData} from "../type";

export class ReflectUtils {

  public static getClassPropertyType(instance: any, key: string): string {
    return Reflect.getMetadata(EMetaData.TYPE, instance, key);
  }

  public static getClassMethodReturnType(instance: any, key: string): string {
    return Reflect.getMetadata(EMetaData.RETURN_TYPE, instance, key);
  }

  public static getClassMethodParamTypes(instance: any, key: string): { [idx: number]: any } {
    return Reflect.getMetadata(EMetaData.PARAM_TYPES, instance, key);
  }

}