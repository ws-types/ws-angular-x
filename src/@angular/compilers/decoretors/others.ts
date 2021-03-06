import "reflect-metadata";
import * as uuid from "uuid/v4";
import {
    RequireScope, RequireStrict, RequireEScope,
    RequireEStrict, InptuEType, InputType
} from "./../../metadata/common";

export const InputMetaKey = Symbol("ngx-metadata:Input");
export const OutputMetaKey = Symbol("ngx-metadata:Output");
export const OnMetaKey = Symbol("ngx-metadata:On");
export const WatchMetaKey = Symbol("ngx-metadata:Watch");
export const ModuleConfigMetaKey = Symbol("ngx-metadata:ModuleConfig");
export const ModuleRunMetaKey = Symbol("ngx-metadata:ModuleRun");
export const RequireMetaKey = Symbol("ngx-metadata:DirectiveRequire");
export const TempRefMetaKey = Symbol("ngx-metadata:TemplateRef");
export const ParamsTypeMetaKey = "design:paramtypes";

export interface IInputProperty {
    isString: boolean;
    isTwoWay?: boolean;
    keyName: string;
    outAlias?: string;
}

export interface IOutputProperty {
    keyName: string;
    outAlias?: string;
}

export interface IOnProperty {
    eventKey: string;
    FuncName: string;
}

export interface IWatchProperty {
    watchKey: string;
    FuncName: string;
}

export interface IModuleConfigProperty {
    depts?: string[];
    FuncName: string;
}

export interface IRequireProperty {
    keyName: string;
    require: string;
    scope: RequireScope;
    strict: RequireStrict;
}

export interface ITemplateRefProperty {
    keyName: string;
    tempName: string;
}

export function Require(requireName: string, scope: RequireEScope = RequireScope.InnerParent, strict: RequireEStrict = false) {
    let tScope: RequireScope;
    if (!scope) {
        tScope = RequireScope.Current;
    } else {
        tScope = scope === "^" ? RequireScope.InnerParent : scope === "^^" ? RequireScope.Parent : RequireScope.Current;
    }
    let tStrict: RequireStrict;
    if (typeof (strict) === "string") {
        tStrict = strict === "?" ? RequireStrict.Unstrict : RequireStrict.Strict;
    } else {
        tStrict = !strict ? RequireStrict.Unstrict : RequireStrict.Strict;
    }
    return function requireDecorator(target, propertyKey: string) {
        const values: IRequireProperty[] = Reflect.getMetadata(RequireMetaKey, target) || [];
        values.push({ strict: tStrict, require: requireName, keyName: propertyKey || uuid(), scope: tScope });
        Reflect.defineMetadata(RequireMetaKey, values, target);
    };
}

export function ViewChild(tempName?: string) {
    return function tempRefDecorator(target, propertyKey: string) {
        const values: ITemplateRefProperty[] = Reflect.getMetadata(TempRefMetaKey, target) || [];
        values.push({ keyName: propertyKey, tempName: tempName || propertyKey });
        Reflect.defineMetadata(TempRefMetaKey, values, target);
    };
}

export function Input(aliasOrIsString: boolean | string = false, twoWay: InptuEType = false) {
    let alias: string;
    let isString = false;
    let isTwoway = false;
    if (typeof (aliasOrIsString) === "string") {
        alias = aliasOrIsString;
        isString = twoWay === null || twoWay === InputType.String;
        isTwoway = twoWay === true || twoWay === InputType.TwoWay;
    } else {
        isString = aliasOrIsString === true;
        isTwoway = false;
    }
    return function inputDecorator(target, propertyKey: string) {
        const values: IInputProperty[] = Reflect.getMetadata(InputMetaKey, target) || [];
        values.push({ isString: isString, keyName: propertyKey || uuid(), outAlias: alias, isTwoWay: isTwoway });
        Reflect.defineMetadata(InputMetaKey, values, target);
    };
}

export function Output(config?: any) {
    return function outputDecorator(target, propertyKey: string) {
        const values: string[] = Reflect.getMetadata(OutputMetaKey, target) || [];
        values.push(propertyKey || uuid());
        Reflect.defineMetadata(OutputMetaKey, values, target);
    };
}

export function On(key: string) {
    return function onEventDecorator(target, propertyKey: string) {
        const values: IOnProperty[] = Reflect.getMetadata(OnMetaKey, target) || [];
        values.push({ eventKey: key, FuncName: propertyKey || uuid() });
        Reflect.defineMetadata(OnMetaKey, values, target);
    };
}

export function Watch(key: string) {
    return function watchDecorator(target, propertyKey: string) {
        const values: IWatchProperty[] = Reflect.getMetadata(WatchMetaKey, target) || [];
        values.push({ watchKey: key, FuncName: propertyKey || uuid() });
        Reflect.defineMetadata(WatchMetaKey, values, target);
    };
}

export function Config(...depts: string[]) {
    return function mdConfigDecorator(target, propertyKey: string) {
        const values: IModuleConfigProperty[] = Reflect.getMetadata(ModuleConfigMetaKey, target) || [];
        values.push({ depts: depts, FuncName: propertyKey || uuid() });
        Reflect.defineMetadata(ModuleConfigMetaKey, values, target);
    };
}

export function Run(...depts: string[]) {
    return function mdRunDecorator(target, propertyKey: string) {
        const values: IModuleConfigProperty[] = Reflect.getMetadata(ModuleRunMetaKey, target) || [];
        values.push({ depts: depts, FuncName: propertyKey || uuid() });
        Reflect.defineMetadata(ModuleRunMetaKey, values, target);
    };
}

export function Property(propName?: string, readonly = false, enumerable = true) {
    return function propertyDecoretor(target, key: string) {
        Object.defineProperty(target, key, {
            get: () => target[`${propName || "__ngx_" + key}`],
            set: readonly ? undefined : (value) => { target[`${propName || "__ngx_" + key}`] = value; },
            enumerable: enumerable
        });
    };
}

export function Enumerable() {
    return function enumerableDecoretor(target, key: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = true;
        return descriptor;
    };
}
