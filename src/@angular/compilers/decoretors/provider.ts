import "reflect-metadata";
import * as angular from "angular";
import * as uuid from "uuid/v4";
import * as decamel from "decamelize";
import { IProviderConfig, IProviderClass, IClass, ICommonController, I18nConfig, I18nPropery } from "./../../metadata";
import { CreateProvider } from "../creators/provider";
import { ParamsTypeMetaKey } from "./others";
import { DI, Inject } from "../../di/container";
import { ProviderGenerator } from "./../generators";
import { I18N_SELECTOR } from "./../../i18n/config";
import { NGX_I18N_CONFIG } from "./../../i18n";


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
        typeof (config) === "string" ? { name: config } :
            config;
    const generator = CreateProvider(nConfig);
    target = registerDI(target, generator);
    target.$inject = injectI18n(target);
    class ProviderClass extends target {
        public static $inject = target.$inject;
        public i18n: { [selector: string]: string };
        constructor(...args: any[]) {
            super(...args);
            buildI18nData(this, args[args.length - 1], <I18nPropery>nConfig.i18n);
        }
    }
    DI.Register(generator.Selector, target);
    generator.Class(ProviderClass);
    return generator;
}

export function buildI18nData(instance, i18n_conf: NGX_I18N_CONFIG, i18n_propery: I18nPropery) {
    if (i18n_conf && i18n_propery && i18n_propery.files && i18n_conf.Locale) {
        const files = angular.copy(i18n_propery.files);
        const alias = i18n_propery.alias || "i18n";
        const keya = <any>Object.keys(files).find(key => key.toLowerCase() === (i18n_conf.Locale || "").toLowerCase());
        instance[alias] = files[keya];
        if (!instance[alias]) {
            instance[alias] = files[i18n_conf.Default];
        }
        instance["__" + alias] = files;
    }
}

export function injectI18n<T extends any>(target: T) {
    const i18n_key = I18N_SELECTOR;
    const injects = target.$inject;
    if (!injects) { return injects; }
    if (!injects.includes(i18n_key)) {
        injects.push(i18n_key);
    }
    return injects;
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
    } else {
        injects.push(...(target.$inject || []));
    }
    const INJECTS: string[] = [];
    injects.forEach(i => INJECTS.push(typeof (i) === "string" ? i : Inject(i)));
    const argus = DI.GetArguments(target);
    const depts: string[] = [];
    argus.forEach((arg, index) => depts.push(DI.GetKey(types[index]) || (INJECTS[index] || arg) || ""));
    return depts;
}

