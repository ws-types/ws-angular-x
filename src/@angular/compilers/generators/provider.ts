import * as uuid from "uuid/v4";
import {
    IProviderGenerator, IProviderBundle, IProviderConfig,
    GeneratorType, IProviderClass
} from "./../../metadata";
import { SelectorParse } from "../parsers/selector-parser";


export class ProviderGenerator implements IProviderGenerator {

    public get Selector(): string { return this._selector; }
    public get Type() { return GeneratorType.Provider; }

    private _selector: string;
    private _ctrl: IProviderClass;

    constructor(private config: IProviderConfig) {
        if (config.name) {
            this._selector = config.name;
        } else if (!config.selector) {
            this._selector = SelectorParse("service-" + uuid());
        } else {
            this._selector = SelectorParse(config.selector);
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
