import * as uuid from "uuid/v4";
import {
    IPipeGenerator, GeneratorType, IPipeClass,
    IPipeConfig, IPipeBundle
} from "./../../metadata";
import { SelectorParse } from "./../../compilers/parsers/selector-parser";


export class PipeGenerator implements IPipeGenerator {

    public get Selector(): string { return this._selector; }
    public get Type() { return GeneratorType.Pipe; }

    private _selector: string;
    private _ctrl: IPipeClass;

    constructor(private config: IPipeConfig) {
        if (config.name) {
            this._selector = config.name;
        } else {
            this._selector = SelectorParse("pipe-" + uuid());
        }
    }

    public Class(ctrl: IPipeClass) {
        this._ctrl = ctrl;
        return this;
    }

    public Build(): IPipeBundle {
        return () => this._ctrl.prototype.transform;
    }

}
