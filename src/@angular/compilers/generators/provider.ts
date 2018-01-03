import * as uuid from "uuid/v4";
import {
    IProviderGenerator, IProviderBundle, IProviderConfig,
    GeneratorType, IProviderClass
} from "./../../metadata";
import { SelectorParse } from "../parsers/selector-parser";


export class ProviderGenerator implements IProviderGenerator {

    public get Selector(): string { return SelectorParse(this.config.selector); }
    public get Type() { return GeneratorType.Provider; }

    private _ctrl: IProviderClass;

    constructor(private config: IProviderConfig) {
        if (!config.selector) {
            config.selector = "service-" + uuid();
        }
    }

    public Class(ctrl: IProviderClass) {
        this._ctrl = ctrl;
        return this;
    }

    public Build(): IProviderBundle {
        return this._ctrl;
    }

}
