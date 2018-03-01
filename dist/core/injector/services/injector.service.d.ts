/// <reference types="angular" />
import { Type } from "./../../../metadata";
export declare class InjectorService {
    private injector;
    static $inject: string[];
    constructor(injector: ng.auto.IInjectorService);
    Get<T>(v: Type<T> | string): T;
}
