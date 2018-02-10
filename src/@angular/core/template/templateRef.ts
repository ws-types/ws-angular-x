import { ElementRef } from "./elementRef";


export class TemplateRef<T extends HTMLElement> {

    public get elementRef() { return this._eleRf; }

    constructor(private _eleRf: ElementRef<T>) {

    }

}
