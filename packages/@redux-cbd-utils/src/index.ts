import {LazyLoadComponentFactory} from "./utils/LazyComponentFactory";

export const lazyComponentFactory = new LazyLoadComponentFactory();

export {TypeUtils} from "./utils/TypeUtils";
export {LazyLoadComponentFactory} from "./utils/LazyComponentFactory";

export {EntryPoint} from "./annotations/EntryPoint";
export {Single} from "./annotations/Single";
export {Wrapped} from "./annotations/Wrapped";
export {default as Bind} from "autobind-decorator";
