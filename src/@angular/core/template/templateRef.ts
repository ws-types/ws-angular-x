
export class TemplateRef<T> {

    public get nativeElement() { return this._rootElement; }

    constructor(private _rootElement: T) {

    }

}

export interface HTMLNgTemplate extends HTMLElement {
    [propName: string]: any;
}
