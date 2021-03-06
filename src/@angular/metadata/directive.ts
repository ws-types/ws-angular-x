import { IComponentClass, IComponentController, IComponentConfig } from "./component";
import { ViewEncapsulation } from "./enums";
import { IClass, ICommonController } from "./class";
import { CssObject } from "./common";

export interface IDirectiveConfig extends IComponentConfig {
    isolate?: boolean;
    restrict?: string;
    alias?: string;
    merge?: boolean;
    replace?: boolean;
    transclude?: boolean;
    bindingToController?: boolean;
}

export type IDirectiveFn = () => ng.IDirective;

export interface IDirectiveBundle extends IDirectiveFn { }

export interface IDirectiveController extends IComponentController { }

export interface IDirectiveClass extends IClass<IDirectiveBundle, IDirectiveController> {
    $scope?: ng.IScope;
    prototype: IDirectiveController;
}
