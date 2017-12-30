import { ViewEncapsulation } from "@angular/metadata";


export interface IComponentConfig {
    selector: string;
    template: string;
    style?: any;
    styles?: any[];
    encapsulation?: ViewEncapsulation;
}

export interface IComponentBundle extends ng.IComponentOptions { }

