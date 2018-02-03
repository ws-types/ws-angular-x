
export class TemplateRef<T> {

    public get nativeElement() { return this.rootElement; }

    constructor(private rootElement: T) {

    }

}

export interface HTMLNgTemplate extends HTMLElement {
    [propName: string]: any;
}
