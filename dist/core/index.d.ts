export * from "./template/templateRef";
export * from "./template/elementRef";
export * from "./services/compile.service";
import { Ng2Module } from "./../metadata";
export declare function browserDynamic(selector?: string): {
    bootstrapModule: (module?: Ng2Module) => void;
};
