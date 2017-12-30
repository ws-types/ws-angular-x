import { SelectorParse } from "../parsers/selector-parser";
import { TemplateParser } from "@angular/compilers/parsers/template-parser";
import { CssParser } from "@angular/compilers/parsers/css-parser";
import {
    IComponentGenerator, IComponentBundle,
    IComponentConfig, GeneratorType, IComponentClass
} from "@angular/metadata";

export class Componentgenerator implements IComponentGenerator {

    public get Selector(): string { return SelectorParse(this.config.selector); }
    public get Type() { return GeneratorType.Component; }

    public get CssInitLoader() { return this._cssParser.Parse(this.config.selector); }

    private _controller: IComponentClass;
    private _tplParser: TemplateParser;
    private _cssParser: CssParser;

    constructor(private config: IComponentConfig) {
        this._tplParser = new TemplateParser(config.template);
    }

    public Class(controller: IComponentClass) {
        this._controller = controller;
        return this;
    }

    public Build(): IComponentBundle {
        const component: IComponentBundle = {
            bindings: {},
            controller: this._controller,
            controllerAs: this.config.alias || "vm",
            template: this._tplParser.Parse(),
            transclude: true
        };
        return component;
    }

}
