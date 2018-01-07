import { IDirectiveGenerator, IComponentGenerator, IModuleGenerator, IProviderGenerator } from "./generator";
import { IClass, ICommonController } from "./class";
import { IDirectiveClass } from "./directive";
import { IComponentClass } from "./component";
import { IProviderClass } from "./provider";

export type Ng2Module = IModuleClass | IModuleGenerator;
export type Ng2Provider = IProviderGenerator | IProviderClass;
export type Ng2Component = IComponentGenerator | IComponentClass;
export type Ng2Directive = IDirectiveClass | IDirectiveGenerator;
export type Ng2Declaration = Ng2Component | Ng2Directive;

export interface IModuleConfig {
    selector?: string;
    declarations?: Ng2Declaration[];
    imports?: (Ng2Module | IModulePayload)[];
    providers?: Ng2Provider[];
}

export interface IModuleBundle extends ng.IModule { }

export type IModuleConfigFunc = ((...args: any[]) => any) | Array<(string | ((...args: any[]) => any))>;

export interface IModulePayload {
    _ngConfig?: IModuleConfigFunc[];
}

export interface IModuleClass extends IClass<IModuleBundle, ICommonController> {
    new(...args: any[]): IModuleController;
}

export interface IModuleController extends ICommonController { }

