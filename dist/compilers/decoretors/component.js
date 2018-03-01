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
var bind_polyfill_1 = require("./../../utils/bind.polyfill");
var directive_1 = require("./directive");
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
    var selector = config.selector;
    var generator = creators_1.CreateComponent(config);
    var outputs = parseIOProperties(target.prototype, generator);
    var _a = directive_1.createInjects(target), injects = _a.injects, scopeIndex = _a.scopeIndex, elementIndex = _a.elementIndex, attrsIndex = _a.attrsIndex;
    bind_polyfill_1.bindPolyfill();
    var proto = target.prototype;
    var ComponentClass = /** @class */ (function (_super) {
        __extends(ComponentClass, _super);
        function ComponentClass() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            generator.StylesLoad();
            directive_1.mixinDomScope(_this, args[elementIndex], args[attrsIndex]);
            directive_1.mixinScope(_this, args[scopeIndex]);
            return _this;
        }
        ComponentClass.prototype.$onInit = function () {
            var _this = this;
            outputs.forEach(function (emit) { return _this[emit] = new emit_1.EventEmitter(_this[emit]); });
            directive_1.ngTempRefSet(this, generator.ViewChildren);
            if (config.mixin && this["$scope"]) {
                directive_1.mixinClass(this["$scope"], this);
                directive_1.mixinClassProto(this["$scope"], target, this);
            }
            if (proto.ngOnInit) {
                proto.ngOnInit.bind(this)();
            }
        };
        ComponentClass.prototype.$onDestroy = function () {
            generator.StylesUnload();
            if (proto.ngOnDestroy) {
                proto.ngOnDestroy.bind(this)();
            }
        };
        ComponentClass.prototype.$postLink = function () {
            directive_1.ngHostSet(this, selector, true);
            if (proto.ngAfterViewInit) {
                proto.ngAfterViewInit.bind(this)();
            }
        };
        ComponentClass.prototype.$onChanges = function (changes) {
            if (proto.ngOnChanges) {
                proto.ngOnChanges.bind(this)(changes);
            }
        };
        ComponentClass.prototype.$doCheck = function () {
            if (proto.ngDoCheck) {
                proto.ngDoCheck.bind(this)();
            }
        };
        ComponentClass.$inject = injects;
        return ComponentClass;
    }(target));
    generator.Class(ComponentClass);
    return generator;
}
function parseIOProperties(proto, generator) {
    var outputs = [];
    var IOKeys = Reflect.getMetadataKeys(proto);
    IOKeys.forEach(function (key) {
        Reflect.getMetadata(key, proto).forEach(function (prop) {
            switch (key) {
                case others_1.InputMetaKey:
                    var input = prop;
                    generator.Input(input.keyName, input.outAlias, input.isString, input.isTwoWay);
                    break;
                case others_1.OutputMetaKey:
                    generator.Output(prop);
                    outputs.push(prop);
                    break;
                case others_1.RequireMetaKey:
                    var require_1 = prop;
                    generator.Require(require_1.require, require_1.keyName, require_1.scope, require_1.strict);
                    break;
                case others_1.TempRefMetaKey:
                    var tempRef = prop;
                    generator.ViewChild(tempRef.tempName, tempRef.keyName);
                    break;
            }
        });
    });
    return outputs;
}
//# sourceMappingURL=component.js.map