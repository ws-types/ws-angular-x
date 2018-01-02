/// <reference types="angular" />
import { IModuleConfig, IModuleBundle } from "@angular/metadata";
import { IDirectiveGenerator, IModuleGenerator, IComponentGenerator, IProviderGenerator, GeneratorType, IModuleClass } from "@angular/metadata";
import { Injectable } from "angular";
export declare class ModuleGenerator implements IModuleGenerator {
    readonly Selector: string;
    readonly Type: GeneratorType;
    readonly Controller: IModuleClass;
    private _components;
    private _directives;
    private _providers;
    private _imports;
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
    Class(ctrl: IModuleClass): this;
    Config(func: Injectable<Function>): this;
    Run(func: Injectable<Function>): this;
    Build(): IModuleBundle;
    private moduleConstructions();
}
