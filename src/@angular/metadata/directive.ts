import { IComponentClass, IComponentController, IComponentConfig } from "./component";
import { ViewEncapsulation } from "./enums";
import { IClass, ICommonController } from "./class";
import { CssOnject } from "./common";

export interface IDirectiveConfig extends IComponentConfig {
    isolate?: boolean;
    restrict?: string;
    alias?: string;
    replace?: boolean;
    bindingToController?: boolean;
}

export type IDirectiveFn = () => ng.IDirective;

export interface IDirectiveBundle extends IDirectiveFn { }

export interface IDirectiveController extends IComponentController { }

export interface IDirectiveClass extends IClass<IDirectiveBundle, IDirectiveController> {
    prototype: IDirectiveController;
}
