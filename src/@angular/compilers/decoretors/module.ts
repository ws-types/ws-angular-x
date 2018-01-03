import * as uuid from "uuid/v4";
import * as decamel from "decamelize";
import { IModuleConfig, IModuleGenerator, IModuleClass } from "./../../metadata";
import { Module } from "./../creators/module";
import { parseInjectsAndDI } from "./provider";
import { ParamsTypeMetaKey, ModuleRunMetaKey } from "./others";
import { ModuleGenerator } from "./../generators";
import { ModuleConfigMetaKey, IModuleConfigProperty } from "./others";
import { Injectable } from "angular";


export function NgModule(config: IModuleConfig) {
    return function decorator<T extends IModuleClass>(target: T) {
        target.generator = configGenerator(target, config);
    };
}

export function $NgModule(config: IModuleConfig) {
    return {
        Decorate: <T extends IModuleClass>(target: T): T => {
            target.generator = configGenerator(target, config);
            return target;
        }
    };
}

function configGenerator<T extends IModuleClass>(target: T, config: IModuleConfig) {
    const generator = Module(fixConfigSelector(target, config));
    target.$inject = createInjects(target);
    parseConfigProperties(target.prototype, generator);
    generator.Class(target);
    return generator;
}

function fixConfigSelector<T extends IModuleClass>(target: T, config: IModuleConfig) {
    const name = !config.selector ? `${decamel(target.name, "-")}-${uuid()}` : config.selector;
    config.selector = name;
    return config;
}

function createInjects(target: IModuleClass) {
    return parseInjectsAndDI(target, Reflect.getMetadata(ParamsTypeMetaKey, target) || []);
}

function parseConfigProperties(proto: any, generator: ModuleGenerator) {
    const IOKeys = Reflect.getMetadataKeys(proto);
    IOKeys.forEach(key => {
        (Reflect.getMetadata(key, proto) as any[]).forEach(prop => {
            if (key === ModuleConfigMetaKey || key === ModuleRunMetaKey) {
                const param = prop as IModuleConfigProperty;
                const inectables: Injectable<Function> = !param.depts || param.depts.length === 0 ?
                    proto[param.FuncName] :
                    [...param.depts, proto[param.FuncName]];
                if (key === ModuleConfigMetaKey) {
                    generator.Config(inectables);
                } else {
                    generator.Run(inectables);
                }
            }
        });
    });
}
