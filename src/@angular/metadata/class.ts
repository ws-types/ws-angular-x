import { IGenerator } from "./generator";


export interface IClass<T> {
    new(...args: any[]): ng.IController;
    generator?: IGenerator<T>;
}
