import { IProviderConfig } from "@angular/metadata";
import { ProviderGenerator } from "./../generators/provider";


export function CreateProvider(config: IProviderConfig) {
    return new ProviderGenerator(config);
}
