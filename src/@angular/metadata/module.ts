import { IDirectiveGenerator, IComponentGenerator, IModuleGenerator, IProviderGenerator } from "./generator";


export type DeclarationElement = IComponentGenerator | IDirectiveGenerator;

export interface IModuleConfig {
    selector: string;
    declarations?: DeclarationElement[];
    imports?: IModuleGenerator[];
    providers?: IProviderGenerator[];
}

export interface IModuleBundle extends ng.IModule { }

