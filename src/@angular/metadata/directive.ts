import { ViewEncapsulation } from "@angular/metadata";


export interface IDirectivetConfig {
    selector: string;
    template: string;
    style?: any;
    styles?: any[];
    encapsulation?: ViewEncapsulation;
}

export type IDirectiveFn = () => ng.IDirective;

export interface IDirectiveBundle extends IDirectiveFn { }
