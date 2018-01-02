import "reflect-metadata";
import { IProviderConfig, IProviderClass } from "@angular/metadata";
export declare function Injectable(config?: IProviderConfig | string): <T extends IProviderClass>(target: T) => void;
export declare function $Injectable(config?: IProviderConfig | string): {
    Decorate: <T extends IProviderClass>(target: T) => T;
};
export declare function parseInjectsAndDI<T>(target: T, types: any[]): string[];
