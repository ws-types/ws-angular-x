import { IClass } from "./class";


export interface IProviderConfig {
    selector: string;
}

export interface IProviderBundle extends Function { }

export interface IProviderClass extends IClass<IProviderBundle> { }
