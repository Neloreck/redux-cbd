export const Single = () => <T extends  new(...args: Array<any>) => {}>(target: T): any => {

  const originalConstructor: T = target;

  const newConstructor = Object.assign(function (...args: Array<any>) {

    // @ts-ignore
    if (!originalConstructor.__INSTANCE__) {
      // @ts-ignore
      originalConstructor.__INSTANCE__ = new originalConstructor(...args);
    }

    // @ts-ignore
    return originalConstructor.__INSTANCE__;
  }, target);

  newConstructor.prototype = originalConstructor.prototype;

  return newConstructor;
};
