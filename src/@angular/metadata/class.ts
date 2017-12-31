import { IGenerator } from "./generator";

export interface Type<T> extends Function {
    new(...args: any[]): T;
}

export interface IClass<T> {
    new(...args: any[]): ng.IController;
    generator?: IGenerator<T>;
}
