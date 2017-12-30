import { IModuleConfig } from "@angular/metadata";
import { ModuleGenerator } from "../generators/module";


export function Module(config: IModuleConfig) {
    return new ModuleGenerator(config);
}
