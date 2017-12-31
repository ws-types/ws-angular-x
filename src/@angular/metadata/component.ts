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
    $onInit?(): void;
    $postLink?(): void;
    $onChanges?(changes: any): void;
    $onDestroy?(): void;
}

