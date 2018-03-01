import { IProviderGenerator, IProviderBundle, IProviderConfig, GeneratorType, IProviderClass } from "./../../metadata";
export declare class ProviderGenerator implements IProviderGenerator {
    private config;
    readonly Selector: string;
    readonly Type: GeneratorType;
    private _selector;
    private _ctrl;
    constructor(config: IProviderConfig);
    Class(ctrl: IProviderClass): this;
    Build(): IProviderBundle;
}
