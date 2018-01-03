"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("angular");
var uuid = require("uuid/v4");
var selector_parser_1 = require("../parsers/selector-parser");
var metadata_1 = require("./../../metadata");
var errors_1 = require("./../../utils/errors");
var ModuleGenerator = (function () {
    function ModuleGenerator(config) {
        this._configs = [];
        this._runs = [];
        this._isOldMd = false;
        if (!config) {
            throw errors_1.errors.ModuleConfigMissing();
        }
        if (typeof (config) === "string") {
            this.config = { selector: config };
            this._isOldMd = true;
        }
        else {
            this.config = config;
            this.selectorUnique(config);
            this.elementsParse(config);
        }
    }
    Object.defineProperty(ModuleGenerator.prototype, "Selector", {
        get: function () { return this._isOldMd ? this.config.selector : selector_parser_1.SelectorParse(this.config.selector); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModuleGenerator.prototype, "Type", {
        get: function () { return metadata_1.GeneratorType.Module; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModuleGenerator.prototype, "Controller", {
        get: function () { return this._ctrl; },
        enumerable: true,
        configurable: true
    });
    ModuleGenerator.prototype.elementsParse = function (config) {
        this._components = parseElements(config.declarations, metadata_1.GeneratorType.Component);
        this._directives = parseElements(config.declarations, metadata_1.GeneratorType.Directive);
        this._providers = parseElements(config.providers);
        this._imports = parseElements(config.imports);
    };
    ModuleGenerator.prototype.selectorUnique = function (config) {
        if (!config.selector) {
            config.selector = "module-" + uuid();
        }
    };
    /**
     * register a component generator
     *
     * @param {IComponentGenerator} grt
     * @returns
     * @memberof ModuleGenerator
     */
    ModuleGenerator.prototype.Component = function (grt) {
        if (this._isOldMd) {
            throw errors_1.errors.OldModuleActions();
        }
        if (this._components.findIndex(function (i) { return i.Selector === grt.Selector; }) >= 0) {
            throw errors_1.errors.DeclarationExist(grt.Selector);
        }
        this._components.push(grt);
        return this;
    };
    ModuleGenerator.prototype.Directive = function (grt) {
        if (this._isOldMd) {
            throw errors_1.errors.OldModuleActions();
        }
        if (this._directives.findIndex(function (i) { return i.Selector === grt.Selector; }) >= 0) {
            throw errors_1.errors.DeclarationExist(grt.Selector);
        }
        this._directives.push(grt);
        return this;
    };
    ModuleGenerator.prototype.Provider = function (grt) {
        if (this._isOldMd) {
            throw errors_1.errors.OldModuleActions();
        }
        if (this._providers.findIndex(function (i) { return i.Selector === grt.Selector; }) >= 0) {
            throw errors_1.errors.DeclarationExist(grt.Selector);
        }
        this._providers.push(grt);
        return this;
    };
    ModuleGenerator.prototype.Class = function (ctrl) {
        if (this._isOldMd) {
            throw errors_1.errors.OldModuleActions();
        }
        this._ctrl = ctrl;
        return this;
    };
    ModuleGenerator.prototype.Config = function (func) {
        this._configs.push(func);
        return this;
    };
    ModuleGenerator.prototype.Run = function (func) {
        this._runs.push(func);
        return this;
    };
    ModuleGenerator.prototype.Build = function () {
        var _this = this;
        if (this._isOldMd) {
            return angular.module(this.config.selector);
        }
        var instance = this.moduleConstructions();
        var depts = [];
        if (this._imports && this._imports.length > 0) {
            this._imports.forEach(function (md) {
                if (md.Selector === _this.Selector) {
                    throw errors_1.errors.ModuleDuplicated(md.Selector);
                }
                depts.push(md.Build().name);
            });
        }
        var module = angular.module(this.Selector, depts);
        if (this._directives && this._directives.length > 0) {
            this._directives.forEach(function (directive) { return module.directive(directive.Selector, directive.Build()); });
        }
        if (this._components && this._components.length > 0) {
            this._components.forEach(function (component) { return module.component(component.Selector, component.Build()); });
        }
        if (this._providers && this._providers.length > 0) {
            this._providers.forEach(function (provider) { return module.service(provider.Selector, provider.Build()); });
        }
        if (this._configs && this._configs.length > 0) {
            this._configs.forEach(function (configFn) { return module.config(configFn); });
        }
        if (this._runs && this._runs.length > 0) {
            this._runs.forEach(function (runFn) { return module.run(runFn); });
        }
        return module;
    };
    ModuleGenerator.prototype.moduleConstructions = function () {
        // const injects: string[] = this.Controller.prototype.$inject || [];
        // const params: any[] = [];
        // console.log(DI.Providers);
        // injects.forEach(key => params.push(DI.GetValue(key)));
        // console.log(params);
        var instance = new (this.Controller)();
        return instance;
    };
    return ModuleGenerator;
}());
exports.ModuleGenerator = ModuleGenerator;
function parseElements(elements, flag) {
    var results = [];
    if (elements && elements.length > 0) {
        elements.forEach(function (e) {
            var ele = parseToGenerator(e);
            if (!flag ? true : flag === ele.Type) {
                if (checkDuplicated(results, ele)) {
                    throw errors_1.errors.ElementDuplicated(ele.Selector);
                }
                results.push(ele);
            }
        });
        return results;
    }
    return [];
}
function checkDuplicated(results, ele) {
    return results.filter(function (i) { return i.Type === ele.Type; }).findIndex(function (i) { return i.Selector === ele.Selector; }) >= 0;
}
function parseToGenerator(e) {
    var ele;
    if (e.generator) {
        // type is controller with generator payload, means from decoretor.
        ele = e.generator;
    }
    else {
        // type is generator, comes from creating manually.
        ele = e;
    }
    if (!ele.Type) {
        throw errors_1.errors.ElementType(ele);
    }
    return ele;
}
//# sourceMappingURL=module.js.map