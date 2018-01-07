import { ViewEncapsulation } from "./enums";
import { IClass, ICommonController } from "./class";
import { CssOnject } from "./common";

export interface IComponentConfig {
    selector: string;
    template?: string;
    templateUrl?: string;
    style?: CssOnject;
    styles?: CssOnject[];
    styleUrls?: string[];
    alias?: string;
    encapsulation?: ViewEncapsulation;
}

export interface IComponentBundle extends ng.IComponentOptions { }

export interface IComponentController extends ICommonController {
    $onInit?: () => void;
    $postLink?: () => void;
    $onChanges?: (changes: any) => void;
    $onDestroy?: () => void;
    $doCheck?: () => void;
    ngOnInit?(): void;
    ngAfterViewInit?(): void;
    ngChanges?(changes: any): void;
    ngOnDestroy?(): void;
    ngDoCheck?(): void;
}

export interface IComponentClass extends IClass<IComponentBundle, IComponentController> {
    prototype: IComponentController;
}

