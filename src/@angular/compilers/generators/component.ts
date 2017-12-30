import { SelectorParse } from "../parsers/selector-parser";
import { TemplateParser } from "@angular/compilers/parsers/template-parser";
import { CssParser } from "@angular/compilers/parsers/css-parser";
import {
    IComponentGenerator, IComponentBundle,
    IComponentConfig, GeneratorType, IComponentClass
} from "@angular/metadata";

export class ComponentGenerator implements IComponentGenerator {

    public get Selector(): string { return SelectorParse(this.config.selector); }
    public get Type() { return GeneratorType.Component; }

    public get StylesLoad(): Function { return this._cssParser.Parse(); }

    private _controller: IComponentClass;
    private _tplParser: TemplateParser;
    private _cssParser: CssParser;
    private _bindings: { [key: string]: ">" | "=" } = {};

    constructor(private config: IComponentConfig) {
        this._tplParser = new TemplateParser(config.template, config);
        this._cssParser = new CssParser(config.styles || [config.style], config);
    }

    public Class(controller: IComponentClass) {
        this._controller = controller;
        return this;
    }

    public Input(key: string, isTwoWay = true) {
        this._bindings[key] = isTwoWay ? "=" : ">";
        return this;
    }

    public Build(): IComponentBundle {
        const component: IComponentBundle = {
            bindings: this._bindings,
            controller: this._controller,
            controllerAs: this.config.alias || "vm",
            template: this._tplParser.Parse(),
            transclude: true
        };
        return component;
    }

}
