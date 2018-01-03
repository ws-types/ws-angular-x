import { IDirectiveConfig } from "./../../metadata";
import { DirectiveGenerator } from "./../generators/directive";


export function CreateDirective(config: IDirectiveConfig) {
    return new DirectiveGenerator(config);
}
