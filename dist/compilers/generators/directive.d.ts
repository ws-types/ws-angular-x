import { BaseGenerator } from "./component";
import { IDirectiveGenerator, IDirectiveBundle, IDirectiveConfig, GeneratorType, IDirectiveClass } from "@angular/metadata";
export declare class DirectiveGenerator extends BaseGenerator<IDirectiveBundle, IDirectiveClass, IDirectiveConfig> implements IDirectiveGenerator {
    protected config: IDirectiveConfig;
    readonly Type: GeneratorType;
    readonly StylesLoad: Function;
    eventMaps: {
        [methodName: string]: Function;
    };
    onMaps: {
        [methodName: string]: (...params: any[]) => void;
    };
    watchMaps: {
        [methodName: string]: (...params: any[]) => void;
    };
    constructor(config: IDirectiveConfig);
    Input(key: string, isObject?: boolean): this;
    Output(key: string): this;
    OnEvent(key: string, func: Function): this;
    On(key: string, func: (...params: any[]) => void): this;
    Watch(key: string, func: (...params: any[]) => void): this;
    Build(): IDirectiveBundle;
}
