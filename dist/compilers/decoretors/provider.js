"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var uuid = require("uuid/v4");
var decamel = require("decamelize");
var provider_1 = require("../creators/provider");
var others_1 = require("./others");
var reflect_1 = require("@angular/compilers/features/reflect");
function Injectable(config) {
    return function decorator(target) {
        var generator = createExtends(config, target);
        target.generator = generator;
    };
}
exports.Injectable = Injectable;
function $Injectable(config) {
    return {
        Decorate: function (target) {
            var generator = createExtends(config, target);
            target.generator = generator;
            return target;
        }
    };
}
exports.$Injectable = $Injectable;
function createExtends(config, target) {
    var nConfig = !config ? { selector: decamel(target.name, "-") + "-" + uuid() } :
        typeof (config) === "string" ? { selector: config } :
            config;
    var generator = provider_1.CreateProvider(nConfig);
    reflect_1.DI.Register(generator.Selector, target = registerDI(target, generator));
    generator.Class(target);
    return generator;
}
function registerDI(target, generator) {
    var types = Reflect.getMetadata(others_1.ParamsTypeMetaKey, target) || [];
    var injects = parseInjectsAndDI(target, types);
    target.$inject = injects;
    return target;
}
function parseInjectsAndDI(target, types) {
    var injects = (target.$inject || []).slice();
    var argus = reflect_1.DI.GetArguments(target);
    types.forEach(function (ctor, index) {
        if (index + 1 > injects.length) {
            injects.push(reflect_1.DI.GetKey(ctor) || argus[index]);
        }
    });
    return injects;
}
exports.parseInjectsAndDI = parseInjectsAndDI;
//# sourceMappingURL=provider.js.map