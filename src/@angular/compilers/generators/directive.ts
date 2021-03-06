import { SelectorParse } from "../parsers/selector-parser";
import { TemplateParser } from "../parsers/template-parser";
import { CssParser } from "../parsers/css-parser";
import { ComponentGenerator, BaseGenerator } from "./component";
import {
    IDirectiveGenerator, IDirectiveBundle,
    IDirectiveConfig, GeneratorType, IDirectiveClass
} from "./../../metadata";
import { EventEmitter } from "./../features/emit";
import { UnisolateScopeBindingError } from "./../../utils/errors";

export class DirectiveGenerator
    extends BaseGenerator<IDirectiveBundle, IDirectiveClass, IDirectiveConfig> implements IDirectiveGenerator {

    public get Type() { return GeneratorType.Directive; }
    public get StylesLoad(): Function { return this._css.Parse(); }
    public get StylesUnload(): Function { return this._css.Dispose(); }

    private onMaps: { [methodName: string]: (...params: any[]) => void } = {};
    private watchMaps: { [methodName: string]: (...params: any[]) => void } = {};

    constructor(protected config: IDirectiveConfig) {
        super(config);
        if ((!this.config.bindingToController && this.config.bindingToController !== false) || this.config.bindingToController) {
            this.config.bindingToController = true;
        } else {
            this.config.bindingToController = false;
        }
        if ((!this.config.isolate && this.config.isolate !== false) || this.config.isolate) {
            this.config.isolate = true;
        } else {
            this.config.isolate = false;
            this.config.bindingToController = false;
        }
        if ((!this.config.transclude && this.config.transclude !== false) || this.config.transclude) {
            this.config.transclude = true;
        } else {
            this.config.transclude = false;
        }
        if (this.config.merge) {
            this.config.merge = true;
        } else {
            this.config.merge = false;
        }
    }

    public Input(key: string, alias?: string, isString = false, isTwoWay = false) {
        if (!this.config.isolate) {
            throw UnisolateScopeBindingError();
        }
        this._bindings[key] = `${!isString ? isTwoWay ? "=" : "<" : "@"}${alias || ""}`;
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
            const direc: ng.IDirective<any> = {
                bindToController: this.config.bindingToController,
                restrict: this.config.restrict || "E",
                template: this._tpl.Parse(),
                controller: this._ctrl,
                controllerAs: this.config.alias || "vm",
                replace: this.config.replace || false,
                transclude: this.config.transclude,
                require: this._requires,
                link: (scope, element, attrs, ctrls) => {
                    if (this.onMaps) {
                        Object.keys(this.onMaps).forEach(name => {
                            if (name === "init") {
                                this.onMaps[name](scope, element, attrs, ctrls);
                                return;
                            }
                            scope.$on("$" + name, () => {
                                this.onMaps[name](scope, element, attrs, ctrls);
                            });
                        });
                    }
                    if (this.watchMaps) {
                        Object.keys(this.watchMaps).forEach(name => {
                            scope.$watch((this.config.bindingToController ? `${this.config.alias || "vm"}.` : "") + name, () => {
                                this.watchMaps[name](scope, element, attrs, ctrls);
                            });
                        });
                    }
                }
            };
            if (this.config.merge) {
                direc.scope = false;
            } else if (this.config.isolate) {
                direc.scope = this._bindings;
            } else {
                direc.scope = true;
            }
            return direc;
        };
        return directive;
    }

}
