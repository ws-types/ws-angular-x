
export class TemplateRef<T extends HTMLElement> {

    public get nativeElement() { return this._rootElement; }
    private _a: string;

    constructor(private _rootElement: T) {
        this._rootElement = _rootElement.cloneNode(true) as any;
    }

}

export interface HTMLNgTemplate extends HTMLElement {
    [propName: string]: any;
}
