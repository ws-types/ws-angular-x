import { IClass, ICommenClass, ICommonController } from "./class";
import { I18nConfig } from "./common";

export interface PipeTransform {
    transform(value: any, ...args: any[]): any;
}

export interface IPipeController extends PipeTransform, ICommonController {

}

export interface IPipeConfig {
    name: string;
    i18n?: I18nConfig;
}

export type IPipeBundle = Function | ng.Injectable<Function>;

export interface IPipeClass extends IClass<IPipeBundle, IPipeController> {
    new(...args: any[]): IPipeController;
    prototype: IPipeController;
}
