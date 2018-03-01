export declare class ReflectContainer {
    readonly Providers: [string, any][];
    private __providers;
    constructor();
    Register(key: string, value: any): void;
    GetKey(value: any): string;
    GetValue(key: string): any;
    GetArguments(func: any): string[];
}
export declare const DI: ReflectContainer;
export declare function Inject(func: any): string;
export declare function Injects(func_names: any[]): string[];
