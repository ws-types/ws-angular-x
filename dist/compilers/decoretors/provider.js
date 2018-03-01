"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var angular = require("angular");
var uuid = require("uuid/v4");
var decamel = require("decamelize");
var provider_1 = require("../creators/provider");
var others_1 = require("./others");
var container_1 = require("../../di/container");
var config_1 = require("./../../i18n/config");
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
        typeof (config) === "string" ? { name: config } :
            config;
    var generator = provider_1.CreateProvider(nConfig);
    target = registerDI(target, generator);
    target.$inject = injectI18n(target);
    var ProviderClass = /** @class */ (function (_super) {
        __extends(ProviderClass, _super);
        function ProviderClass() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            buildI18nData(_this, args[args.length - 1], nConfig.i18n);
            return _this;
        }
        ProviderClass.$inject = target.$inject;
        return ProviderClass;
    }(target));
    container_1.DI.Register(generator.Selector, target);
    generator.Class(ProviderClass);
    return generator;
}
function buildI18nData(instance, i18n_conf, i18n_propery) {
    if (i18n_conf && i18n_propery && i18n_propery.files && i18n_conf.Locale) {
        var files = angular.copy(i18n_propery.files);
        var alias = i18n_propery.alias || "i18n";
        var keya = Object.keys(files).find(function (key) { return key.toLowerCase() === (i18n_conf.Locale || "").toLowerCase(); });
        instance[alias] = files[keya];
        if (!instance[alias]) {
            instance[alias] = files[i18n_conf.Default];
        }
        instance["__" + alias] = files;
    }
}
exports.buildI18nData = buildI18nData;
function injectI18n(target) {
    var i18n_key = config_1.I18N_SELECTOR;
    var injects = target.$inject;
    if (!injects) {
        return injects;
    }
    if (!injects.includes(i18n_key)) {
        injects.push(i18n_key);
    }
    return injects;
}
exports.injectI18n = injectI18n;
function registerDI(target, generator) {
    var types = Reflect.getMetadata(others_1.ParamsTypeMetaKey, target) || [];
    var injects = parseInjectsAndDI(target, types);
    target.$inject = injects;
    return target;
}
function parseInjectsAndDI(target, types) {
    var injects = [];
    if (target.$injector) {
        injects.push.apply(injects, target.$injector());
    }
    else {
        injects.push.apply(injects, (target.$inject || []));
    }
    var INJECTS = [];
    injects.forEach(function (i) { return INJECTS.push(typeof (i) === "string" ? i : container_1.Inject(i)); });
    var argus = container_1.DI.GetArguments(target);
    var depts = [];
    argus.forEach(function (arg, index) { return depts.push(container_1.DI.GetKey(types[index]) || (INJECTS[index] || arg) || ""); });
    return depts;
}
exports.parseInjectsAndDI = parseInjectsAndDI;
//# sourceMappingURL=provider.js.map