import { SelectorParse } from "../parsers/selector-parser";
import { TemplateParser } from "../parsers/template-parser";
import { CssParser } from "../parsers/css-parser";
import {
    IComponentGenerator, IComponentBundle, IGenerator,
    IComponentConfig, GeneratorType, IComponentClass,
    RequireScope, RequireStrict
} from "./../../metadata";

export interface IBindings { [key: string]: string; }

export abstract class BaseGenerator<TBundle, TClass, TConfig extends { selector: string }> implements IGenerator<TBundle> {

    public get Selector(): string { return SelectorParse(this.config.selector); }
    public get Type() { return GeneratorType.None; }
    public get ViewChildren() { return this._viewChilds; }

    protected _ctrl: TClass;
    protected _tpl: TemplateParser;
    protected _css: CssParser;
    protected _bindings: IBindings = {};
    protected _requires: { [propName: string]: string } = {};
    protected _viewChilds: Array<[string, string]> = [];

    constructor(protected config: TConfig) {
        this._tpl = new TemplateParser(<any>config);
        this._css = new CssParser(<any>config);
    }

    public Class(controller: TClass) {
        this._ctrl = controller;
        return this;
    }

    public Input(key: string, alias?: string, isString = false, isTwoWay = false) {
        this._bindings[key] = `${!isString ? isTwoWay ? "=" : "<" : "@"}${alias || ""}`;
        return this;
    }

    public Output(key: string) {
        this._bindings[key] = "&";
        return this;
    }

    public Require(require: string, propName: string, scope: RequireScope, strict: RequireStrict) {
        this._requires[propName] = `${strict}${scope}${require}`;
        return this;
    }

    public ViewChild(tempName: string, keyName: string) {
        this._viewChilds.push([keyName, tempName]);
        return this;
    }

    public abstract Build(): TBundle;

}

export class ComponentGenerator
    extends BaseGenerator<IComponentBundle, IComponentClass, IComponentConfig> implements IComponentGenerator {

    public get Type() { return GeneratorType.Component; }
    public get StylesLoad(): Function { return this._css.Parse(); }
    public get StylesUnload(): Function { return this._css.Dispose(); }

    protected _ctrl: IComponentClass;
    protected _tpl: TemplateParser;
    protected _css: CssParser;
    protected _bindings: IBindings = {};

    constructor(protected config: IComponentConfig) {
        super(config);
    }

    public Build(): IComponentBundle {
        const component: IComponentBundle = {
            bindings: this._bindings,
            controller: this._ctrl,
            controllerAs: this.config.alias || "vm",
            template: this._tpl.Parse(),
            require: this._requires,
            transclude: true
        };
        return component;
    }

}
