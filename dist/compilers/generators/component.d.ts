import { TemplateParser } from "../parsers/template-parser";
import { CssParser } from "../parsers/css-parser";
import { IComponentGenerator, IComponentBundle, IGenerator, IComponentConfig, GeneratorType, IComponentClass, RequireScope, RequireStrict } from "./../../metadata";
import { ElementRef } from "./../../core/template/elementRef";
export interface IBindings {
    [key: string]: string;
}
export declare abstract class BaseGenerator<TBundle, TClass, TConfig extends {
    selector: string;
}> implements IGenerator<TBundle> {
    protected config: TConfig;
    readonly Selector: string;
    readonly Type: GeneratorType;
    readonly ViewChildren: [string, ElementRef<any>][];
    protected _ctrl: TClass;
    protected _tpl: TemplateParser;
    protected _css: CssParser;
    protected _bindings: IBindings;
    protected _requires: {
        [propName: string]: string;
    };
    protected _viewChilds: Array<[string, ElementRef<any>]>;
    constructor(config: TConfig);
    Class(controller: TClass): this;
    Input(key: string, alias?: string, isString?: boolean, isTwoWay?: boolean): this;
    Output(key: string): this;
    Require(require: string, propName: string, scope: RequireScope, strict: RequireStrict): this;
    ViewChild(tempName: string, keyName: string): this;
    abstract Build(): TBundle;
}
export declare class ComponentGenerator extends BaseGenerator<IComponentBundle, IComponentClass, IComponentConfig> implements IComponentGenerator {
    protected config: IComponentConfig;
    readonly Type: GeneratorType;
    readonly StylesLoad: Function;
    readonly StylesUnload: Function;
    protected _ctrl: IComponentClass;
    protected _tpl: TemplateParser;
    protected _css: CssParser;
    protected _bindings: IBindings;
    constructor(config: IComponentConfig);
    Build(): IComponentBundle;
}
