import * as uuid from "uuid/v4";
import * as decamel from "decamelize";
import { IPipeConfig, IPipeClass } from "./../../metadata";
import { CreatePipe } from "./../creators";
import { SelectorParse } from "../parsers/selector-parser";


export function Pipe(config?: IPipeConfig | string) {
    return function decorator<T extends IPipeClass>(target: T) {
        const generator = createController(config, target);
        target.generator = generator.Class(target);
    };
}

export function $Pipe(config?: IPipeConfig | string) {
    return {
        Decorate: <T extends IPipeClass>(target: T): T => {
            const generator = createController(config, target);
            target.generator = generator.Class(target);
            return target;
        }
    };
}

function createController<T extends IPipeClass>(config: string | IPipeConfig, target: T) {
    const nConfig = !config ? { name: SelectorParse(`${decamel(target.name, "-")}-${uuid()}`) } :
        typeof (config) === "string" ? { name: config } :
            config;
    const generator = CreatePipe(nConfig);
    if (!target.prototype.transform) {
        target.prototype.transform = (value, ...args: any[]) => value;
    }
    return generator;
}
