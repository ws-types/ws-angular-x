import { TemplateParser } from "@angular/compilers/parsers/template-parser";
import { CssParser } from "@angular/compilers/parsers/css-parser";
import { IComponentGenerator, IComponentBundle, IGenerator, IComponentConfig, GeneratorType, IComponentClass } from "@angular/metadata";
export interface IBindings {
    [key: string]: "<" | "@" | "&" | "=";
}
export declare abstract class BaseGenerator<TBundle, TClass, TConfig extends {
    selector: string;
}> implements IGenerator<TBundle> {
    protected config: TConfig;
    readonly Selector: string;
    readonly Type: GeneratorType;
    protected _ctrl: TClass;
    protected _tpl: TemplateParser;
    protected _css: CssParser;
    protected _bindings: IBindings;
    constructor(config: TConfig);
    Class(controller: TClass): this;
    Input(key: string, isObject?: boolean): this;
    Output(key: string): this;
    abstract Build(): TBundle;
}
export declare class ComponentGenerator extends BaseGenerator<IComponentBundle, IComponentClass, IComponentConfig> implements IComponentGenerator {
    protected config: IComponentConfig;
    readonly Type: GeneratorType;
    readonly StylesLoad: Function;
    protected _ctrl: IComponentClass;
    protected _tpl: TemplateParser;
    protected _css: CssParser;
    protected _bindings: IBindings;
    constructor(config: IComponentConfig);
    Build(): IComponentBundle;
}
