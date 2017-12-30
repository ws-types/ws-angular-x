import { IModuleConfig, IModuleGenerator, IModuleClass } from "@angular/metadata";
import { Module } from "./../creators/module";


export function NgModule(config: IModuleConfig) {
    return function decorator<T extends IModuleClass>(target: T) {
        const generator = Module(config);
        target.generator = generator;
    };
}
