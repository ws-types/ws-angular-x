import { IGenerator } from "./generator";


export interface IClass<T> {
    new(...params: any[]): ng.IController;
    generator?: IGenerator<T>;
}
