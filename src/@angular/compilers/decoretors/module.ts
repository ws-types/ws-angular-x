import { IModuleConfig, IModuleGenerator, IModuleClass } from "@angular/metadata";
import { Module } from "./../creators/module";
import { parseInjectsAndDI } from "./provider";
import { ParamsTypeMetaKey } from "./others";


export function NgModule(config: IModuleConfig) {
    return function decorator<T extends IModuleClass>(target: T) {
        const generator = Module(config);
        const injects = createInjects(target);
        target.$inject = injects;
        generator.Class(target);
        target.generator = generator;
    };
}

function createInjects(target: IModuleClass) {
    return parseInjectsAndDI(target, Reflect.getMetadata(ParamsTypeMetaKey, target) || []);
}
