import { IComponentConfig } from "@angular/metadata";
import { ComponentGenerator } from "./../generators";

export function CreateComponent(config: IComponentConfig) {
    return new ComponentGenerator(config);
}
