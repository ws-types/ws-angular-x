import "reflect-metadata";
import { IComponentConfig, IComponentClass } from "@angular/metadata";
export declare function Component(config: IComponentConfig): <T extends IComponentClass>(target: T) => void;
export declare function $Component(config: IComponentConfig): {
    Decorate: <T extends IComponentClass>(target: T) => T;
};
export declare function parseLifeCycleHooks(proto: any): {
    [name: string]: (...params: any[]) => void;
};
