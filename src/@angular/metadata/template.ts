export interface IElementRef<T> {
    scope?: IRefScope;
    nativeElement: T;
}

export interface HTMLNgTemplate extends HTMLElement {
    [propName: string]: any;
}

export interface IRefScope extends ng.IScope {
    $parent: IRefScope;
    [propName: string]: any;
}
