import { IRefScope, IElementRef } from "./../../metadata";


export class ElementRef<T extends HTMLElement> implements IElementRef<T> {

    constructor(public nativeElement: T, public scope?: ng.IScope) { }

    public setContext(_scope: ng.IScope) {
        this.scope = _scope;
        return this;
    }

    public createView(): T {
        return this.nativeElement.cloneNode(true) as any;
    }

    public createContext(): IRefScope {
        return this.scope && this.scope.$new(false, this.scope);
    }

}
