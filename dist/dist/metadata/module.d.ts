import { IDirectiveGenerator, IComponentGenerator, IModuleGenerator, IProviderGenerator } from "./generator";
import { IClass, ICommonController } from "./class";
import { IDirectiveClass } from "./directive";
import { IComponentClass } from "./component";
import { IProviderClass } from "./provider";
export declare type Ng2Module = IModuleClass | IModuleGenerator;
export declare type Ng2Provider = IProviderGenerator | IProviderClass;
export declare type Ng2Component = IComponentGenerator | IComponentClass;
export declare type Ng2Directive = IDirectiveClass | IDirectiveGenerator;
export declare type Ng2Declaration = Ng2Component | Ng2Directive;
export interface IModuleConfig {
    selector?: string;
    declarations?: Ng2Declaration[];
    imports?: Ng2Module[];
    providers?: Ng2Provider[];
}
export interface IModuleBundle extends ng.IModule {
}
export interface IModuleClass extends IClass<IModuleBundle, ICommonController> {
    new (...args: any[]): IModuleController;
}
export interface IModuleController extends ICommonController {
    $payload?(): void;
}
