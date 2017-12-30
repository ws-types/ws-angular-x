import { ViewEncapsulation } from "./enums";
import { IClass } from "./class";


export interface IDirectivetConfig {
    selector: string;
    template: string;
    style?: string;
    styles?: string[];
    encapsulation?: ViewEncapsulation;
}

export type IDirectiveFn = () => ng.IDirective;

export interface IDirectiveBundle extends IDirectiveFn { }

export interface IDirectiveClass extends IClass<IDirectiveBundle> { }
