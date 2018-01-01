import "reflect-metadata";
import * as uuid from "uuid/v4";
import * as decamel from "decamelize";
import { IProviderConfig, IProviderClass } from "@angular/metadata";
import { CreateProvider } from "../creators/provider";
import { ParamsTypeMetaKey } from "./others";
import { DI } from "@angular/compilers/features/reflect";
import { ProviderGenerator } from "./../generators";


export function Injectable(config?: IProviderConfig | string) {
    return function decorator<T extends IProviderClass>(target: T) {
        const generator = createExtends(config, target);
        target.generator = generator;
    };
}

export function $Injectable(config?: IProviderConfig | string) {
    return {
        Decorate: <T extends IProviderClass>(target: T): T => {
            const generator = createExtends(config, target);
            target.generator = generator;
            return target;
        }
    };
}

function createExtends(config: string | IProviderConfig, target: IProviderClass) {
    const nConfig = !config ? { selector: `${decamel(target.name, "-")}-${uuid()}` } :
        typeof (config) === "string" ? { selector: config } :
            config;
    const generator = CreateProvider(nConfig);
    DI.Register(generator.Selector, target = registerDI(target, generator));
    generator.Class(target);
    return generator;
}

function registerDI(target: IProviderClass, generator: ProviderGenerator): IProviderClass {
    const types: any[] = Reflect.getMetadata(ParamsTypeMetaKey, target) || [];
    const injects = parseInjectsAndDI(target, types);
    target.$inject = injects;
    return target;
}

export function parseInjectsAndDI<T>(target: T, types: any[]): string[] {
    const injects: string[] = [...((<any>target).$inject || [])];
    const argus = DI.GetArguments(target);
    types.forEach((ctor, index) => {
        if (index + 1 > injects.length) {
            injects.push(DI.GetKey(ctor) || argus[index]);
        }
    });
    return injects;
}

