import { ViewEncapsulation } from "./enums";
import { IClass } from "./class";

export interface IComponentConfig {
    selector: string;
    template: string;
    style?: string;
    styles?: string[];
    alias?: string;
    encapsulation?: ViewEncapsulation;
}

export interface IComponentBundle extends ng.IComponentOptions { }

export interface IComponentClass extends IClass<IComponentBundle> { }

