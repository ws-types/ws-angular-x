import { IDirectiveConfig } from "@angular/metadata";
import { DirectiveGenerator } from "./../generators/directive";


export function CreateDirective(config: IDirectiveConfig) {
    return new DirectiveGenerator(config);
}
