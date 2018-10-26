export const Single = () => <T extends  new(...args: Array<any>) => {}>(target: T): any => {

  const originalConstructor: T = target;

  const newConstructor = function (...args: Array<any>) {

    if (!originalConstructor.prototype.__INSTANCE__) {
      originalConstructor.prototype.__INSTANCE__ = new originalConstructor(...args);
    }

    return originalConstructor.prototype.__INSTANCE__;
  };

  newConstructor.prototype = originalConstructor.prototype;

  return newConstructor;
};
