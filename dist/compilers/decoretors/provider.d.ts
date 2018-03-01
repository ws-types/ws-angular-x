import "reflect-metadata";
import { IProviderConfig, IProviderClass, IClass, ICommonController } from "./../../metadata";
export declare function Injectable(config?: IProviderConfig | string): <T extends IProviderClass>(target: T) => void;
export declare function $Injectable(config?: IProviderConfig | string): {
    Decorate: <T extends IProviderClass>(target: T) => T;
};
export declare function injectI18n<T extends any>(target: T): any;
export declare function parseInjectsAndDI<T extends IClass<any, ICommonController>>(target: T, types: any[]): string[];
