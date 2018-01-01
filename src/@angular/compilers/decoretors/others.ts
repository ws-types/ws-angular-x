import "reflect-metadata";
import * as uuid from "uuid/v4";

export const InputMetaKey = Symbol("ng-metadata:Input");
export const OutputMetaKey = Symbol("ng-metadata:Output");
export const OnMetaKey = Symbol("ng-metadata:On");
export const WatchMetaKey = Symbol("ng-metadata:Watch");
export const ModuleConfigMetaKey = Symbol("ng-metadata:ModuleConfig");
export const ParamsTypeMetaKey = "design:paramtypes";

export interface IInputProperty {
    isString: boolean;
    keyName: string;
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
    FuncName: string;
}

export function Input(isString = false) {
    return function inputDecorator(target, propertyKey: string) {
        const values: IInputProperty[] = Reflect.getMetadata(InputMetaKey, target) || [];
        values.push({ isString: isString, keyName: propertyKey || uuid() });
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

export function ModuleConfig(key?: string) {
    return function mdConfigDecorator(target, propertyKey: string) {
        const values: IModuleConfigProperty[] = Reflect.getMetadata(ModuleConfigMetaKey, target) || [];
        values.push({ FuncName: propertyKey || uuid() });
        Reflect.defineMetadata(ModuleConfigMetaKey, values, target);
    };
}
