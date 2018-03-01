import { IModuleConfig, IModuleClass } from "./../../metadata";
export declare function NgModule(config: IModuleConfig): <T extends IModuleClass>(target: T) => void;
export declare function $NgModule(config: IModuleConfig): {
    Decorate: <T extends IModuleClass>(target: T) => T;
};
