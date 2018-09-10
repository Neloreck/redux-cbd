export const ActionHandler = <T>(instance: T, method: string, descriptor: PropertyDescriptor) => {
    // Runtime assertion.
  const secondParam = Reflect.getMetadata("design:paramtypes", instance, method)[1];


  if (!secondParam.getInternalType || typeof secondParam.getInternalType !== 'function') {
    throw new Error(`Wrong second action handler param provided for handling. Reducer: ${instance.constructor.name}, ` +
      `method: ${method}, paramType: ${secondParam && secondParam.name || secondParam}.`);
  }

};
