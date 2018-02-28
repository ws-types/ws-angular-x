import { IClass, ICommenClass, ICommonController } from "./class";
import { I18nConfig } from "./common";


export interface IProviderConfig {
    selector?: string;
    name?: string;
    i18n?: I18nConfig;
}

export interface IProviderBundle extends Function { }

export interface IProviderClass extends IClass<IProviderBundle, ICommonController> {
    new(...args: any[]): ICommonController;
}
