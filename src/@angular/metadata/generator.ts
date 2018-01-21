import { IComponentBundle } from "./component";
import { IDirectiveBundle } from "./directive";
import { IProviderBundle } from "./provider";
import { IModuleBundle, IModuleLazys } from "./module";
import { IPipeBundle } from "./pipe";
import { Injectable } from "angular";

export enum GeneratorType {
    Component = "component",
    Directive = "directive",
    Provider = "provider",
    Pipe = "pipe",
    Module = "ng_module",
    None = "undefined"
}

export interface IGenerator<T> {
    Selector: string;
    Type: string;
    Build(): T;
}

export interface IComponentGenerator extends IGenerator<IComponentBundle> {
    StylesLoad?: Function;
    StylesUnload?: Function;
}

export interface IDirectiveGenerator extends IGenerator<IDirectiveBundle> {
    StylesLoad?: Function;
    StylesUnload?: Function;
}

export interface IProviderGenerator extends IGenerator<IProviderBundle> { }

export interface IPipeGenerator extends IGenerator<IPipeBundle> { }

export interface IModuleGenerator extends IGenerator<IModuleBundle> {
    LazyLoads?: IModuleLazys[];
    LazyConfig?(func: Injectable<Function>);
    RunLazyLoads?(handler: (lazy: IModuleLazys) => void);
    Config?(func: Injectable<Function>);
    Run?(func: Injectable<Function>);
}
