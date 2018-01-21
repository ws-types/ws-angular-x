import * as angular from "angular";
import * as uuid from "uuid/v4";

import { SelectorParse } from "../parsers/selector-parser";
import {
    IModuleConfig, IModuleBundle,
    IModulePayload, IPipeGenerator, Ng2Pipe, IModuleLazys
} from "./../../metadata";

import {
    IGenerator, IDirectiveGenerator, IModuleGenerator,
    IComponentGenerator, IProviderGenerator, IClass,
    Ng2Component, Ng2Directive, Ng2Declaration,
    Ng2Provider, Ng2Module, GeneratorType, IModuleClass
} from "./../../metadata";

import { errors } from "./../../utils/errors";
import { Injectable } from "angular";


export class ModuleGenerator implements IModuleGenerator {

    public get Selector() { return this._isOldMd ? this.config.selector : SelectorParse(this.config.selector); }
    public get Type() { return GeneratorType.Module; }

    public get Controller() { return this._ctrl; }

    private _components: IComponentGenerator[];
    private _directives: IDirectiveGenerator[];
    private _providers: IProviderGenerator[];
    private _pipes: IPipeGenerator[];
    private _imports: IModuleGenerator[];

    private _lazy_confs: Injectable<Function>[] = [];
    private _lazy_payload: Array<IModuleLazys> = [];

    public get LazyLoads() { return this._lazy_payload; }

    private _configs: Injectable<Function>[] = [];
    private _runs: Injectable<Function>[] = [];

    private _ctrl: IModuleClass;
    private _isOldMd = false;

    private config: IModuleConfig;

    constructor(config: IModuleConfig | string) {
        if (!config) {
            throw errors.ModuleConfigMissing();
        }
        if (typeof (config) === "string") {
            this.config = { selector: config };
            this._isOldMd = true;
        } else {
            this.config = config;
            this.selectorUnique(config);
            this.elementsParse(config);
        }
    }

    private elementsParse(config: IModuleConfig) {
        this._imports = parseElements(this.parseModulePayload(config));
        this._components = parseElements(<Ng2Component[]>config.declarations, GeneratorType.Component);
        this._directives = parseElements(<Ng2Directive[]>config.declarations, GeneratorType.Directive);
        this._pipes = parseElements(<Ng2Pipe[]>config.declarations, GeneratorType.Pipe);
        this._providers = parseElements(config.providers);
    }

    private selectorUnique(config: IModuleConfig) {
        if (!config.selector) {
            config.selector = "module-" + uuid();
        }
    }

    /**
     * register a component generator
     *
     * @param {IComponentGenerator} grt
     * @returns
     * @memberof ModuleGenerator
     */
    public Component(grt: IComponentGenerator) {
        if (this._isOldMd) {
            throw errors.OldModuleActions();
        }
        if (this._components.findIndex(i => i.Selector === grt.Selector) >= 0) {
            throw errors.DeclarationExist(grt.Selector);
        }
        this._components.push(grt);
        return this;
    }

    public Directive(grt: IDirectiveGenerator) {
        if (this._isOldMd) {
            throw errors.OldModuleActions();
        }
        if (this._directives.findIndex(i => i.Selector === grt.Selector) >= 0) {
            throw errors.DeclarationExist(grt.Selector);
        }
        this._directives.push(grt);
        return this;
    }

    public Provider<T>(grt: IProviderGenerator) {
        if (this._isOldMd) {
            throw errors.OldModuleActions();
        }
        if (this._providers.findIndex(i => i.Selector === grt.Selector) >= 0) {
            throw errors.DeclarationExist(grt.Selector);
        }
        this._providers.push(grt);
        return this;
    }

    public Pipe<T>(grt: IPipeGenerator) {
        if (this._isOldMd) {
            throw errors.OldModuleActions();
        }
        if (this._pipes.findIndex(i => i.Selector === grt.Selector) >= 0) {
            throw errors.DeclarationExist(grt.Selector);
        }
        this._pipes.push(grt);
        return this;
    }

    public Class(ctrl: IModuleClass) {
        if (this._isOldMd) {
            throw errors.OldModuleActions();
        }
        this._ctrl = ctrl;
        return this;
    }

    public Config(func: Injectable<Function>) {
        this._configs.push(func);
        return this;
    }

    public LazyConfig(func: Injectable<Function>) {
        this._lazy_confs.push(func);
        return this;
    }

    public Run(func: Injectable<Function>) {
        this._runs.push(func);
        return this;
    }

    public RunLazyLoads(handler: (lazy: IModuleLazys) => void) {
        this._lazy_payload.forEach(lazy => handler(lazy));
        this._lazy_payload = [];
        return this;
    }

    public Build(): IModuleBundle {
        if (this._isOldMd) {
            return angular.module(this.config.selector);
        }
        this._configs.push(...this._lazy_confs);
        this._lazy_confs = [];
        const instance = this.moduleConstructions();
        const depts = [];
        if (this._imports && this._imports.length > 0) {
            this._imports.forEach(md => {
                if (md.Selector === this.Selector) {
                    throw errors.ModuleDuplicated(md.Selector);
                }
                depts.push(md.Build().name);
            });
        }
        const module = angular.module(this.Selector, depts);
        if (this._directives && this._directives.length > 0) {
            this._directives.forEach(directive => module.directive(directive.Selector, directive.Build()));
        }
        if (this._components && this._components.length > 0) {
            this._components.forEach(component => module.component(component.Selector, component.Build()));
        }
        if (this._pipes && this._pipes.length > 0) {
            this._pipes.forEach(pipe => module.filter(pipe.Selector, pipe.Build()));
        }
        if (this._providers && this._providers.length > 0) {
            this._providers.forEach(provider => module.service(provider.Selector, provider.Build()));
        }
        if (this._configs && this._configs.length > 0) {
            this._configs.forEach(configFn => module.config(configFn));
        }
        if (this._runs && this._runs.length > 0) {
            this._runs.forEach(runFn => module.run(runFn));
        }
        return module;
    }

    private parseModulePayload(config: IModuleConfig) {
        const imports: Ng2Module[] = [];
        (config.imports || []).forEach(ipt => {
            if ((<IModulePayload>ipt)._ngConfig) {
                ((<IModulePayload>ipt)._ngConfig || []).forEach(conf => this.LazyConfig(conf));
                ((<IModulePayload>ipt)._ngInvokers || []).forEach(invoker => invoker(this));
                this._lazy_payload.push((<IModulePayload>ipt)._ngPayload);
            } else {
                imports.push(<Ng2Module>ipt);
            }
        });
        return imports;
    }

    private moduleConstructions() {
        const instance = new (this.Controller)();
        return instance;
    }
}

function parseElements<T>(elements: (IGenerator<T> | IClass<T, any>)[], flag?: string): IGenerator<T>[] {
    const results: IGenerator<T>[] = [];
    if (elements && elements.length > 0) {
        elements.forEach(e => {
            const ele = parseToGenerator(e);
            if (!flag ? true : flag === ele.Type) {
                if (checkDuplicated(results, ele)) {
                    throw errors.ElementDuplicated(ele.Selector);
                }
                results.push(ele);
            }
        });
        return results;
    }
    return [];
}

function checkDuplicated<T>(results: IGenerator<T>[], ele: IGenerator<T>) {
    return results.filter(i => i.Type === ele.Type).findIndex(i => i.Selector === ele.Selector) >= 0;
}

function parseToGenerator<T>(e: IGenerator<T> | IClass<T, any>): IGenerator<T> {
    let ele: IGenerator<T>;
    if ((<IClass<T, any>>e).generator) {
        // type is controller with generator payload, means from decoretor.
        ele = (e as IClass<T, any>).generator;
    } else {
        // type is generator, comes from creating manually.
        ele = e as IGenerator<T>;
    }
    if (!ele.Type) {
        throw errors.ElementType(ele);
    }
    return ele;
}
