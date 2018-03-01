/// <reference types="angular" />
import { IModuleConfig, IModuleBundle, IPipeGenerator, IModuleLazys } from "./../../metadata";
import { IDirectiveGenerator, IModuleGenerator, IComponentGenerator, IProviderGenerator, GeneratorType, IModuleClass } from "./../../metadata";
import { Injectable } from "angular";
export declare class ModuleGenerator implements IModuleGenerator {
    readonly Selector: string;
    readonly Type: GeneratorType;
    readonly Controller: IModuleClass;
    private _components;
    private _directives;
    private _providers;
    private _constants;
    private _pipes;
    private _imports;
    private _lazy_confs;
    private _lazy_payload;
    readonly LazyLoads: IModuleLazys[];
    private _configs;
    private _runs;
    private _ctrl;
    private _isOldMd;
    private config;
    constructor(config: IModuleConfig | string);
    private elementsParse(config);
    private selectorUnique(config);
    /**
     * register a component generator
     *
     * @param {IComponentGenerator} grt
     * @returns
     * @memberof ModuleGenerator
     */
    Component(grt: IComponentGenerator): this;
    Directive(grt: IDirectiveGenerator): this;
    Provider<T>(grt: IProviderGenerator): this;
    Pipe<T>(grt: IPipeGenerator): this;
    Class(ctrl: IModuleClass): this;
    Config(func: Injectable<Function>): this;
    LazyConfig(func: Injectable<Function>): this;
    Run(func: Injectable<Function>): this;
    RunLazyLoads(handler: (lazy: IModuleLazys) => void): this;
    Build(): IModuleBundle;
    private parseModulePayload(config);
    private moduleConstructions();
}
