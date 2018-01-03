/// <reference types="angular" />
import { ViewEncapsulation } from "./enums";
import { IClass, ICommonController } from "./class";
import { CssOnject } from "./common";
export interface IDirectiveConfig {
    selector: string;
    template: string;
    style?: CssOnject;
    styles?: CssOnject[];
    encapsulation?: ViewEncapsulation;
    isolate?: boolean;
    restrict?: string;
    alias?: string;
    bindingToController?: boolean;
}
export declare type IDirectiveFn = () => ng.IDirective;
export interface IDirectiveBundle extends IDirectiveFn {
}
export interface IDirectiveController extends ICommonController {
    $onInit?(): void;
    $postLink?(): void;
    $onChanges?(changes: any): void;
    $onDestroy?(): void;
    $doCheck?(): void;
}
export interface IDirectiveClass extends IClass<IDirectiveBundle, IDirectiveController> {
}
