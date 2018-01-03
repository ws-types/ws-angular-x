/// <reference types="angular" />
import "reflect-metadata";
export declare class ReflectContainer {
    readonly Providers: {
        [key: string]: any;
    };
    private _providers;
    constructor();
    Register(key: string, value: any): void;
    GetKey(value: any): string;
    GetValue(key: string): any;
    GetArguments(func: any): string[];
}
export declare const DI: ReflectContainer;
export declare function Inject(func: ng.IController): string;
export declare function Injects(func_names: (ng.IController | string)[]): string[];
