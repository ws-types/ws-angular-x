import { ViewEncapsulation } from "./enums";
import { IClass } from "./class";
import { CssOnject } from "./common";

export interface IComponentConfig {
    selector: string;
    template: string;
    style?: CssOnject;
    styles?: CssOnject[];
    alias?: string;
    encapsulation?: ViewEncapsulation;
}

export interface IComponentBundle extends ng.IComponentOptions { }

export interface IComponentClass extends IClass<IComponentBundle> {
    $onInit?(...params: any[]): void;
    $postLink?(...params: any[]): void;
    $onChanges?(...params: any[]): void;
    $onDestroy?(...params: any[]): void;
}

