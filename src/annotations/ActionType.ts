export const ActionType = (actionType: string): ((target: any) => any) => {
  return (constructor: (...args: Array<any>) => any ) => {
    constructor.prototype.type = actionType;
  };
};
