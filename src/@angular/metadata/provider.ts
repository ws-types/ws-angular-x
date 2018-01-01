import { IClass, ICommenClass, ICommonController } from "./class";


export interface IProviderConfig {
    selector?: string;
}

export interface IProviderBundle extends Function { }

export interface IProviderClass extends IClass<IProviderBundle, ICommonController> {
    new(...args: any[]): ICommonController;
}
