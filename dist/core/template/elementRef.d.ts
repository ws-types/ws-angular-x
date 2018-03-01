/// <reference types="angular" />
import { IRefScope, IElementRef } from "./../../metadata";
export declare class ElementRef<T extends HTMLElement> implements IElementRef<T> {
    nativeElement: T;
    scope: ng.IScope;
    constructor(nativeElement: T, scope?: ng.IScope);
    setContext(_scope: ng.IScope): this;
    createView(): T;
    createContext(): IRefScope;
}
