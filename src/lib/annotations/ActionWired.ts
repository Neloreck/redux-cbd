export const ActionWired = (actionType: string): ((target: any) => any) => {
  return (constructor: (...args: Array<any>) => any ) => {
    constructor.prototype.type = actionType;
  };
};
