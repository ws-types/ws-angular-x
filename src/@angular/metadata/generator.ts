import { IComponentBundle } from "./component";
import { IDirectiveBundle } from "./directive";
import { IProviderBundle } from "./provider";
import { IModuleBundle } from "./module";
import { IPipeBundle } from "./pipe";

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
}

export interface IDirectiveGenerator extends IGenerator<IDirectiveBundle> {
    StylesLoad?: Function;
}

export interface IProviderGenerator extends IGenerator<IProviderBundle> { }

export interface IPipeGenerator extends IGenerator<IPipeBundle> { }

export interface IModuleGenerator extends IGenerator<IModuleBundle> { }
