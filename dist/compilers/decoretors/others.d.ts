import "reflect-metadata";
export declare const InputMetaKey: symbol;
export declare const OutputMetaKey: symbol;
export declare const OnMetaKey: symbol;
export declare const WatchMetaKey: symbol;
export declare const ModuleConfigMetaKey: symbol;
export declare const ModuleRunMetaKey: symbol;
export declare const ParamsTypeMetaKey = "design:paramtypes";
export interface IInputProperty {
    isString: boolean;
    keyName: string;
}
export interface IOnProperty {
    eventKey: string;
    FuncName: string;
}
export interface IWatchProperty {
    watchKey: string;
    FuncName: string;
}
export interface IModuleConfigProperty {
    depts?: string[];
    FuncName: string;
}
export declare function Input(isString?: boolean): (target: any, propertyKey: string) => void;
export declare function Output(config?: any): (target: any, propertyKey: string) => void;
export declare function On(key: string): (target: any, propertyKey: string) => void;
export declare function Watch(key: string): (target: any, propertyKey: string) => void;
export declare function Config(...depts: string[]): (target: any, propertyKey: string) => void;
export declare function Run(...depts: string[]): (target: any, propertyKey: string) => void;
