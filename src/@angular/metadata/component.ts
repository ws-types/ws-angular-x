import { ViewEncapsulation } from "./enums";
import { IClass } from "./class";

export interface IComponentConfig {
    selector: string;
    template: string;
    style?: any;
    styles?: any[];
    encapsulation?: ViewEncapsulation;
}

export interface IComponentBundle extends ng.IComponentOptions { }

export interface IComponentClass extends IClass<IComponentBundle> { }

