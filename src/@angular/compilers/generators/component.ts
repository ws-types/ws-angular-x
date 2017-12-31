import { SelectorParse } from "../parsers/selector-parser";
import { TemplateParser } from "@angular/compilers/parsers/template-parser";
import { CssParser } from "@angular/compilers/parsers/css-parser";
import {
    IComponentGenerator, IComponentBundle,
    IComponentConfig, GeneratorType, IComponentClass
} from "@angular/metadata";

interface IBindings { [key: string]: "<" | "@" | "&"; }

export class ComponentGenerator implements IComponentGenerator {

    public get Selector(): string { return SelectorParse(this.config.selector); }
    public get Type() { return GeneratorType.Component; }

    public get StylesLoad(): Function { return this._css.Parse(); }

    private _ctrl: IComponentClass;
    private _tpl: TemplateParser;
    private _css: CssParser;
    private _bindings: IBindings = {};

    constructor(private config: IComponentConfig) {
        this._tpl = new TemplateParser(config);
        this._css = new CssParser(config);
    }

    public Class(controller: IComponentClass) {
        this._ctrl = controller;
        return this;
    }

    public Input(key: string, isObject = true) {
        this._bindings[key] = isObject ? "<" : "@";
        return this;
    }

    public Output(key: string) {
        this._bindings[key] = "&";
        return this;
    }

    public Build(): IComponentBundle {
        const component: IComponentBundle = {
            bindings: this._bindings,
            controller: this._ctrl,
            controllerAs: this.config.alias || "vm",
            template: this._tpl.Parse(),
            transclude: true
        };
        console.log(this._bindings);
        return component;
    }

}
