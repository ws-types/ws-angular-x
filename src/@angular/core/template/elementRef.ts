
export class ElementRef<T extends HTMLElement> {

    public get nativeElement() { return this._rootElement; }
    public get scope(): IRefScope { return this._scope; }

    constructor(private _rootElement: T, private _scope: ng.IScope) {
        this._rootElement = _rootElement.cloneNode(true) as any;
        this._scope = _scope.$new(false, _scope);
    }

    public createView(): T {
        return this._rootElement.cloneNode(true) as any;
    }

    public createContext(): IRefScope {
        return this._scope.$new(false, this._scope);
    }

}

export interface IRefScope extends ng.IScope {
    $parent: IRefScope;
    [propName: string]: any;
}
