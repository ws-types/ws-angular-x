/// <reference types="angular" />
import { ViewEncapsulation } from "./enums";
import { IClass, ICommonController } from "./class";
import { CssObject, I18nConfig } from "./common";
export interface IComponentConfig {
    selector: string;
    template?: string;
    templateUrl?: string;
    style?: CssObject;
    styles?: Array<CssObject>;
    styleUrls?: string[];
    alias?: string;
    mixin?: boolean;
    useAST?: boolean;
    encapsulation?: ViewEncapsulation;
    i18n?: I18nConfig;
}
export interface IComponentBundle extends ng.IComponentOptions {
}
export interface IComponentController extends ICommonController {
    $onInit?(): void;
    $postLink?(): void;
    $onChanges?(changes: any): void;
    $onDestroy?(): void;
    $doCheck?(): void;
    ngOnInit?(): void;
    ngAfterViewInit?(): void;
    ngOnChanges?(changes: any): void;
    ngOnDestroy?(): void;
    ngDoCheck?(): void;
}
export interface IComponentClass extends IClass<IComponentBundle, IComponentController> {
    $scope?: ng.IScope;
    prototype: IComponentController;
}
