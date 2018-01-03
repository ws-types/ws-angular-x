"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v4");
var decamel = require("decamelize");
var module_1 = require("./../creators/module");
var provider_1 = require("./provider");
var others_1 = require("./others");
var others_2 = require("./others");
function NgModule(config) {
    return function decorator(target) {
        target.generator = configGenerator(target, config);
    };
}
exports.NgModule = NgModule;
function $NgModule(config) {
    return {
        Decorate: function (target) {
            target.generator = configGenerator(target, config);
            return target;
        }
    };
}
exports.$NgModule = $NgModule;
function configGenerator(target, config) {
    var generator = module_1.Module(fixConfigSelector(target, config));
    target.$inject = createInjects(target);
    parseConfigProperties(target.prototype, generator);
    generator.Class(target);
    return generator;
}
function fixConfigSelector(target, config) {
    var name = !config.selector ? decamel(target.name, "-") + "-" + uuid() : config.selector;
    config.selector = name;
    return config;
}
function createInjects(target) {
    return provider_1.parseInjectsAndDI(target, Reflect.getMetadata(others_1.ParamsTypeMetaKey, target) || []);
}
function parseConfigProperties(proto, generator) {
    var IOKeys = Reflect.getMetadataKeys(proto);
    IOKeys.forEach(function (key) {
        Reflect.getMetadata(key, proto).forEach(function (prop) {
            if (key === others_2.ModuleConfigMetaKey || key === others_1.ModuleRunMetaKey) {
                var param = prop;
                var inectables = !param.depts || param.depts.length === 0 ?
                    proto[param.FuncName] : param.depts.concat([proto[param.FuncName]]);
                if (key === others_2.ModuleConfigMetaKey) {
                    generator.Config(inectables);
                }
                else {
                    generator.Run(inectables);
                }
            }
        });
    });
}
//# sourceMappingURL=module.js.map