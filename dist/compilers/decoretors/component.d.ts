import "reflect-metadata";
import { IComponentConfig, IComponentClass } from "./../../metadata";
export declare function Component(config: IComponentConfig): <T extends IComponentClass>(target: T) => void;
export declare function $Component(config: IComponentConfig): {
    Decorate: <T extends IComponentClass>(target: T) => T;
};
