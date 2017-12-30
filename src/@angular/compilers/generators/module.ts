import * as angular from "angular";

import { SelectorParse } from "@angular/compilers/parsers/selector-parser";
import { DeclarationExistError, ElementTypeError } from "@angular/utils/errors";
import { IModuleConfig, IModuleBundle } from "@angular/metadata";
import {
    IGenerator, IDirectiveGenerator, IModuleGenerator,
    IComponentGenerator, IProviderGenerator, IClass
} from "@angular/metadata";


export class ModuleGenerator implements IModuleGenerator {

    public get Selector() { return SelectorParse(this.config.selector); }
    public get Type() { return "ng_module"; }

    private _components: IComponentGenerator[];
    private _directives: IDirectiveGenerator[];
    private _providers: IProviderGenerator[];
    private _imports: IModuleGenerator[];

    constructor(private config: IModuleConfig) {
        this._components = parseElements(<IComponentGenerator[]>config.declarations, "component");
        this._directives = parseElements(<IDirectiveGenerator[]>config.declarations, "directive");
        this._providers = parseElements(config.providers);
        this._imports = parseElements(config.imports);
    }

    public Component(grt: IComponentGenerator) {
        if (this._components.findIndex(i => i.Selector === grt.Selector) >= 0) {
            throw DeclarationExistError(grt.Selector);
        }
        this._components.push(grt);
        return this;
    }

    public Directive(grt: IDirectiveGenerator) {
        if (this._directives.findIndex(i => i.Selector === grt.Selector) >= 0) {
            throw DeclarationExistError(grt.Selector);
        }
        this._directives.push(grt);
        return this;
    }

    public Provider<T>(grt: IProviderGenerator) {
        if (this._providers.findIndex(i => i.Selector === grt.Selector) >= 0) {
            throw DeclarationExistError(grt.Selector);
        }
        this._providers.push(grt);
        return this;
    }

    public Build(): IModuleBundle {
        const module = angular.module(this.Selector, []);
        if (this._directives && this._directives.length > 0) {
            this._directives.forEach(directive => module.directive(directive.Selector, directive.Build()));
        }
        if (this._components && this._components.length > 0) {
            this._components.forEach(component => module.component(component.Selector, component.Build()));
        }
        if (this._providers && this._providers.length > 0) {
            this._providers.forEach(provider => module.service(provider.Selector, provider.Build()));
        }
        return module;
    }

}

function parseElements<T>(elements: (IGenerator<T> | IClass<T>)[], flag?: string): IGenerator<T>[] {
    const results: IGenerator<T>[] = [];
    if (elements && elements.length > 0) {
        elements.forEach(e => {
            let ele: IGenerator<T>;
            if ((<IClass<T>>e).generator) {
                // type is controller with generator payload, means from decoretor.
                ele = (e as IClass<T>).generator;
            } else {
                // type is generator, comes from creating manually.
                ele = e as IGenerator<T>;
            }
            if (!ele.Type) {
                throw ElementTypeError(ele);
            }
            const valid = !flag ? true : flag === ele.Type;
            if (valid) {
                results.push(ele);
            }
        });
        return results;
    }
    return [];
}
