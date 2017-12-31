import { ViewEncapsulation } from "./enums";
import { IClass } from "./class";
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

export type IDirectiveFn = () => ng.IDirective;

export interface IDirectiveBundle extends IDirectiveFn { }

export interface IDirectiveClass extends IClass<IDirectiveBundle> { }
