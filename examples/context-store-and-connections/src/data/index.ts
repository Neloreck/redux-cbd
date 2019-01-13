import {AuthContextManager, IAuthContext} from "./AuthContextManager";
import {DataContextManager, IDataContext} from "./DataContextManager";

export const authContextManager: AuthContextManager = new AuthContextManager();
export const dataContextManager: DataContextManager = new DataContextManager();

export {AuthContextManager, IAuthContext} from "./AuthContextManager";
export {DataContextManager, IDataContext} from "./DataContextManager";
