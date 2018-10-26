/*

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

export class TypeUtils {

  // Runtime type check.

  public static isString(value: any): boolean {
    return (Object.prototype.toString.call(value) === "[object String]");
  }

  public static isArray(value: any): boolean {
    return (Object.prototype.toString.call(value) === "[object Array]");
  }

  public static isBoolean(value: any): boolean {
    return (Object.prototype.toString.call(value) === "[object Boolean]");
  }

  public static isNumber(value: any): boolean {
    return ((Object.prototype.toString.call(value) === "[object Number]") && Number.isFinite(value));
  }

  public static isInteger(value: any): boolean {
    return ((Object.prototype.toString.call(value) === "[object Number]") && Number.isFinite(value) && !(value % 1));
  }

  public static isFunction(value: any): boolean {
    return (value && Object.prototype.toString.call(value) == '[object Function]');
  }

  public static isObject(value: any): boolean {
    return (value === Object(value));
  }

  // Reflect isType.

  public static isArrayType(target: any): boolean {
    return (target === Array);
  }

  public static isBooleanType(target: any): boolean {
    return (target === Boolean);
  }

  public static isNumberType(target: any): boolean {
    return (target === Number);
  }

  public static isStringType(target: any): boolean {
    return (target === String);
  }

  public static isVoidType(target: any): boolean {
    return (target === undefined);
  }

  public static isAnyType(target: any): boolean {
    return (target === Object(target));
  }

}

*/
