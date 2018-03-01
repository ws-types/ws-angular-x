import { IPipeGenerator, GeneratorType, IPipeClass, IPipeConfig, IPipeBundle } from "./../../metadata";
export declare class PipeGenerator implements IPipeGenerator {
    private config;
    readonly Selector: string;
    readonly Type: GeneratorType;
    private _selector;
    private _ctrl;
    constructor(config: IPipeConfig);
    Class(ctrl: IPipeClass): this;
    Build(): IPipeBundle;
}
