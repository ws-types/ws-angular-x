import { IClass, ICommenClass, ICommonController } from "./class";

export interface PipeTransform {
    transform(value: any, ...args: any[]): any;
}

export interface IPipeController extends PipeTransform, ICommonController {

}

export interface IPipeConfig {
    name: string;
}

export type IPipeBundle = Function | ng.Injectable<Function>;

export interface IPipeClass extends IClass<IPipeBundle, IPipeController> {
    new(...args: any[]): IPipeController;
    prototype: IPipeController;
}
