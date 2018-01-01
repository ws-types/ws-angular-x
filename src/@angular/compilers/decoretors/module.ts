import * as uuid from "uuid/v4";
import * as decamel from "decamelize";
import { IModuleConfig, IModuleGenerator, IModuleClass } from "@angular/metadata";
import { Module } from "./../creators/module";
import { parseInjectsAndDI } from "./provider";
import { ParamsTypeMetaKey } from "./others";


export function NgModule(config: IModuleConfig) {
    return function decorator<T extends IModuleClass>(target: T) {
        const generator = Module(fixConfigSelector(target, config));
        const injects = createInjects(target);
        target.$inject = injects;
        generator.Class(target);
        target.generator = generator;
    };
}

export function $NgModule(config: IModuleConfig) {
    return {
        Class: <T extends IModuleClass>(target: T): T => {
            const generator = Module(fixConfigSelector(target, config));
            const injects = createInjects(target);
            target.$inject = injects;
            generator.Class(target);
            target.generator = generator;
            return target;
        }
    };
}

function fixConfigSelector<T extends IModuleClass>(target: T, config: IModuleConfig) {
    const name = !config.selector ? `${decamel(target.name, "-")}-${uuid()}` : config.selector;
    config.selector = name;
    return config;
}

function createInjects(target: IModuleClass) {
    return parseInjectsAndDI(target, Reflect.getMetadata(ParamsTypeMetaKey, target) || []);
}
