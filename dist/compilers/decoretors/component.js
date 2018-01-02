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
var creators_1 = require("./../creators");
var others_1 = require("./others");
var emit_1 = require("./../features/emit");
var provider_1 = require("./provider");
function Component(config) {
    return function compoDecorator(target) {
        var generator = createExtends(target, config);
        target.generator = generator;
    };
}
exports.Component = Component;
function $Component(config) {
    return {
        Decorate: function (target) {
            var generator = createExtends(target, config);
            target.generator = generator;
            return target;
        }
    };
}
exports.$Component = $Component;
function createExtends(target, config) {
    var generator = creators_1.CreateComponent(config);
    var maps = parseLifeCycleHooks(target.prototype);
    var outputs = parseIOProperties(target.prototype, generator);
    var injects = createInjects(target);
    var ComponentClass = (function (_super) {
        __extends(ComponentClass, _super);
        function ComponentClass() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            outputs.forEach(function (emit) { return _this[emit] = new emit_1.EventEmitter(_this[emit]); });
            if (maps.ngOnInit) {
                _this.$onInit = maps.ngOnInit;
            }
            if (maps.ngOnDestroy) {
                _this.$onDestroy = maps.ngOnDestroy;
            }
            if (maps.ngOnChanges) {
                _this.$onChanges = maps.ngOnChanges;
            }
            if (maps.ngDoCheck) {
                _this.$doCheck = maps.ngDoCheck;
            }
            generator.StylesLoad();
            return _this;
        }
        ComponentClass.$inject = injects;
        return ComponentClass;
    }(target));
    generator.Class(ComponentClass);
    return generator;
}
function createInjects(target) {
    return provider_1.parseInjectsAndDI(target, Reflect.getMetadata(others_1.ParamsTypeMetaKey, target) || []);
}
function parseLifeCycleHooks(proto) {
    var maps = {};
    Object.getOwnPropertyNames(proto).forEach(function (name) {
        var propery = proto[name];
        if (name === "ngOnInit" || name === "ngOnDestroy" || name === "ngOnChanges" || name === "ngDoCheck") {
            maps[name] = propery;
        }
    });
    return maps;
}
exports.parseLifeCycleHooks = parseLifeCycleHooks;
function parseIOProperties(proto, generator) {
    var outputs = [];
    var IOKeys = Reflect.getMetadataKeys(proto);
    IOKeys.forEach(function (key) {
        Reflect.getMetadata(key, proto).forEach(function (prop) {
            if (key === others_1.InputMetaKey) {
                var input = prop;
                generator.Input(input.keyName, !input.isString);
            }
            else if (key === others_1.OutputMetaKey) {
                generator.Output(prop);
                outputs.push(prop);
            }
        });
    });
    return outputs;
}
//# sourceMappingURL=component.js.map