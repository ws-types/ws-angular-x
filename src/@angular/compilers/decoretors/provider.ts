import "reflect-metadata";
import * as uuid from "uuid/v4";
import * as decamel from "decamelize";
import { IProviderConfig, IProviderClass, IClass, ICommonController } from "./../../metadata";
import { CreateProvider } from "../creators/provider";
import { ParamsTypeMetaKey } from "./others";
import { DI, Inject } from "./../features/reflect";
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

export function parseInjectsAndDI<T extends IClass<any, ICommonController>>(target: T, types: any[]): string[] {
    const injects: (Function | string)[] = [];
    if (target.$injector) {
        injects.push(...target.$injector());
        console.log(injects);
    } else {
        injects.push(...(target.$inject || []));
    }
    const INJECTS: string[] = [];
    injects.forEach(i => INJECTS.push(typeof (i) === "string" ? i : Inject(i)));
    const argus = DI.GetArguments(target);
    // console.log(argus);
    const depts: string[] = [];
    types.forEach((ctor, index) => depts.push(DI.GetKey(ctor) || (INJECTS[index] || argus[index]) || ""));
    // console.log(depts);
    return depts;
}

