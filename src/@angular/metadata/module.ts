import { IDirectiveGenerator, IComponentGenerator, IModuleGenerator, IProviderGenerator } from "./generator";
import { IClass } from "./class";

export type Ng2Module = IModuleClass | IModuleGenerator;

export type DeclarationElement = IComponentGenerator | IDirectiveGenerator;

export interface IModuleConfig {
    selector: string;
    declarations?: DeclarationElement[];
    imports?: Ng2Module[];
    providers?: IProviderGenerator[];
}

export interface IModuleBundle extends ng.IModule { }

export interface IModuleClass extends IClass<IModuleBundle> { }

