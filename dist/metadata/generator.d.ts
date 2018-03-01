/// <reference types="angular" />
import { IComponentBundle } from "./component";
import { IDirectiveBundle } from "./directive";
import { IProviderBundle } from "./provider";
import { IModuleBundle, IModuleLazys } from "./module";
import { IPipeBundle } from "./pipe";
import { Injectable } from "angular";
import { IElementRef } from "./template";
export declare enum GeneratorType {
    Component = "component",
    Directive = "directive",
    Provider = "provider",
    Pipe = "pipe",
    Module = "ng_module",
    None = "undefined",
}
export interface IGenerator<T> {
    Selector: string;
    Type: string;
    Build(): T;
}
export interface IComponentGenerator extends IGenerator<IComponentBundle> {
    StylesLoad?: Function;
    StylesUnload?: Function;
    ViewChildren?: Array<[string, IElementRef<any>]>;
}
export interface IDirectiveGenerator extends IGenerator<IDirectiveBundle> {
    StylesLoad?: Function;
    StylesUnload?: Function;
}
export interface IProviderGenerator extends IGenerator<IProviderBundle> {
}
export interface IPipeGenerator extends IGenerator<IPipeBundle> {
}
export interface IModuleGenerator extends IGenerator<IModuleBundle> {
    LazyLoads?: IModuleLazys[];
    LazyConfig?(func: Injectable<Function>): any;
    RunLazyLoads?(handler: (lazy: IModuleLazys) => void): any;
    Config?(func: Injectable<Function>): any;
    Run?(func: Injectable<Function>): any;
}
