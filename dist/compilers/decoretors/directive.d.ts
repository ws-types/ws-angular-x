/// <reference types="angular" />
import * as angular from "angular";
import { IDirectiveConfig, IDirectiveClass } from "./../../metadata";
import { ElementRef } from "./../../core/template/elementRef";
export interface IInjectBundle {
    injects: string[];
    scopeIndex?: number;
    elementIndex?: number;
    attrsIndex?: number;
    i18nIndex?: number;
}
export declare function Directive(config: IDirectiveConfig): <T extends IDirectiveClass>(target: T) => void;
export declare function $Directive(config: IDirectiveConfig): {
    Decorate: <T extends IDirectiveClass>(target: T) => T;
};
export declare function ngHostSet(instance: any, selector: string, addHost?: boolean): angular.IRootElementService;
export declare function ngTempRefSet(instance: any, children: Array<[string, ElementRef<any>]>): void;
export declare function mixinScope(instance: any, scope: ng.IScope): void;
export declare function mixinDomScope(instance: any, $element?: ng.IRootElementService, $attrs?: ng.IAttributes): void;
export declare function mixinClass(scope: ng.IScope, instance: any): void;
export declare function mixinClassProto(scope: ng.IScope, target: any, instance: any): void;
export declare function createInjects(target: any, need$Scope?: boolean, need$Element?: boolean, need$Attrs?: boolean, need$i18n?: boolean): IInjectBundle;
