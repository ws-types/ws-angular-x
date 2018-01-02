import { IModuleConfig, IModuleClass } from "@angular/metadata";
export declare function NgModule(config: IModuleConfig): <T extends IModuleClass>(target: T) => void;
export declare function $NgModule(config: IModuleConfig): {
    Decorate: <T extends IModuleClass>(target: T) => T;
};
