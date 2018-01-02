import { SelectorParse } from "../parsers/selector-parser";
import { TemplateParser } from "@angular/compilers/parsers/template-parser";
import { CssParser } from "@angular/compilers/parsers/css-parser";
import { ComponentGenerator, BaseGenerator } from "./component";
import {
    IDirectiveGenerator, IDirectiveBundle,
    IDirectiveConfig, GeneratorType, IDirectiveClass
} from "@angular/metadata";
import { EventEmitter } from "./../features/emit";
import { UnisolateScopeBindingError } from "@angular/utils/errors";

export class DirectiveGenerator
    extends BaseGenerator<IDirectiveBundle, IDirectiveClass, IDirectiveConfig> implements IDirectiveGenerator {

    public get Type() { return GeneratorType.Directive; }
    public get StylesLoad(): Function { return this._css.Parse(); }

    public onMaps: { [methodName: string]: (...params: any[]) => void } = {};
    public watchMaps: { [methodName: string]: (...params: any[]) => void } = {};

    constructor(protected config: IDirectiveConfig) {
        super(config);
        if (!this.config.bindingToController && this.config.bindingToController !== false) {
            this.config.bindingToController = true;
        } else {
            this.config.bindingToController = false;
        }
        if (!this.config.isolate && this.config.isolate !== false) {
            this.config.isolate = true;
        } else {
            this.config.isolate = false;
            this.config.bindingToController = false;
        }
    }

    public Input(key: string, isObject = true) {
        if (!this.config.isolate) {
            throw UnisolateScopeBindingError();
        }
        this._bindings[key] = isObject ? "=" : "@";
        return this;
    }

    public Output(key: string) {
        if (!this.config.isolate) {
            throw UnisolateScopeBindingError();
        }
        this._bindings[key] = "&";
        return this;
    }

    public On(key: string, func: (...params: any[]) => void) {
        this.onMaps[key] = func;
        return this;
    }

    public Watch(key: string, func: (...params: any[]) => void) {
        this.watchMaps[key] = func;
        return this;
    }

    public Build(): IDirectiveBundle {
        const directive: IDirectiveBundle = () => {
            return {
                scope: this.config.isolate ? this._bindings : true,
                bindToController: this.config.bindingToController,
                restrict: this.config.restrict || "E",
                template: this._tpl.Parse(),
                controller: this._ctrl,
                controllerAs: this.config.alias || "vm",
                replace: false,
                transclude: true,
                link: (scope, attr, element, controller) => {
                    if (this.onMaps) {
                        Object.keys(this.onMaps).forEach(name => {
                            scope.$on("$" + name, () => {
                                this.onMaps[name](scope, attr, element, controller);
                            });
                        });
                    }
                    if (this.watchMaps) {
                        Object.keys(this.watchMaps).forEach(name => {
                            scope.$watch((this.config.bindingToController ? `${this.config.alias || "vm"}.` : "") + name, () => {
                                this.watchMaps[name](scope, attr, element, controller);
                            });
                        });
                    }
                }
            };
        };
        return directive;
    }

}
