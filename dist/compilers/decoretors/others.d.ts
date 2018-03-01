import "reflect-metadata";
import { RequireScope, RequireStrict, RequireEScope, RequireEStrict, InptuEType } from "./../../metadata/common";
export declare const InputMetaKey: unique symbol;
export declare const OutputMetaKey: unique symbol;
export declare const OnMetaKey: unique symbol;
export declare const WatchMetaKey: unique symbol;
export declare const ModuleConfigMetaKey: unique symbol;
export declare const ModuleRunMetaKey: unique symbol;
export declare const RequireMetaKey: unique symbol;
export declare const TempRefMetaKey: unique symbol;
export declare const ParamsTypeMetaKey = "design:paramtypes";
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
export declare function Require(requireName: string, scope?: RequireEScope, strict?: RequireEStrict): (target: any, propertyKey: string) => void;
export declare function ViewChild(tempName?: string): (target: any, propertyKey: string) => void;
export declare function Input(aliasOrIsString?: boolean | string, twoWay?: InptuEType): (target: any, propertyKey: string) => void;
export declare function Output(config?: any): (target: any, propertyKey: string) => void;
export declare function On(key: string): (target: any, propertyKey: string) => void;
export declare function Watch(key: string): (target: any, propertyKey: string) => void;
export declare function Config(...depts: string[]): (target: any, propertyKey: string) => void;
export declare function Run(...depts: string[]): (target: any, propertyKey: string) => void;
export declare function Property(propName?: string, readonly?: boolean, enumerable?: boolean): (target: any, key: string) => void;
export declare function Enumerable(): (target: any, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
