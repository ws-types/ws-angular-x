import { IGenerator } from "./generator";
export interface Type<T> extends Function {
    new (...args: any[]): T;
}
export interface ICommonController {
    [propName: string]: any;
}
export interface IDeptController {
    $inject?: ReadonlyArray<any>;
    $injector?(): ReadonlyArray<any>;
}
export interface IClass<TReturn, TThis> extends IDeptController {
    new (...args: any[]): TThis;
    generator?: IGenerator<TReturn>;
}
export interface ICommenClass<T> extends IClass<T, ICommonController> {
}
