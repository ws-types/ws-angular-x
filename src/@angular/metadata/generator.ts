import { IComponentBundle } from "./component";
import { IDirectiveBundle } from "./directive";
import { IProviderBundle } from "./provider";
import { IModuleBundle } from "./module";

export enum GeneratorType {
    Component = "component",
    Directive = "directive",
    Provider = "provider",
    Module = "ng_module"
}

export interface IGenerator<T> {
    Selector: string;
    Type: string;
    Build(): T;
}

export interface IComponentGenerator extends IGenerator<IComponentBundle> { }
export interface IDirectiveGenerator extends IGenerator<IDirectiveBundle> { }
export interface IProviderGenerator extends IGenerator<IProviderBundle> { }
export interface IModuleGenerator extends IGenerator<IModuleBundle> { }
