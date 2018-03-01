import { ElementRef } from "./elementRef";
export declare class TemplateRef<T extends HTMLElement> {
    private _eleRf;
    readonly elementRef: ElementRef<T>;
    constructor(_eleRf: ElementRef<T>);
}
