/// <reference types="angular" />
import { IComponentController, IComponentConfig } from "./component";
import { IClass } from "./class";
export interface IDirectiveConfig extends IComponentConfig {
    isolate?: boolean;
    restrict?: string;
    alias?: string;
    merge?: boolean;
    replace?: boolean;
    transclude?: boolean;
    bindingToController?: boolean;
}
export declare type IDirectiveFn = () => ng.IDirective;
export interface IDirectiveBundle extends IDirectiveFn {
}
export interface IDirectiveController extends IComponentController {
}
export interface IDirectiveClass extends IClass<IDirectiveBundle, IDirectiveController> {
    $scope?: ng.IScope;
    prototype: IDirectiveController;
}
