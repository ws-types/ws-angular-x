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
var component_1 = require("./component");
var creators_1 = require("./../creators");
var others_1 = require("./others");
var emit_1 = require("./../features/emit");
var provider_1 = require("./provider");
function Directive(config) {
    return function direcDecorator(target) {
        var generator = createExtends(config, target);
        target.generator = generator;
    };
}
exports.Directive = Directive;
function $Directive(config) {
    return {
        Decorate: function (target) {
            var generator = createExtends(config, target);
            target.generator = generator;
            return target;
        }
    };
}
exports.$Directive = $Directive;
function createExtends(config, target) {
    var generator = creators_1.CreateDirective(config);
    var maps = component_1.parseLifeCycleHooks(target.prototype);
    var outputs = parseIOProperties(target.prototype, generator);
    var injects = createInjects(target);
    var DirectiveClass = (function (_super) {
        __extends(DirectiveClass, _super);
        function DirectiveClass() {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            var _this = _super.apply(this, params) || this;
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
        DirectiveClass.$inject = injects;
        return DirectiveClass;
    }(target));
    generator.Class(DirectiveClass);
    return generator;
}
function createInjects(target) {
    return provider_1.parseInjectsAndDI(target, Reflect.getMetadata(others_1.ParamsTypeMetaKey, target) || []);
}
function parseIOProperties(proto, generator) {
    var outputs = [];
    var IOKeys = Reflect.getMetadataKeys(proto);
    IOKeys.forEach(function (key) {
        Reflect.getMetadata(key, proto).forEach(function (prop) {
            switch (key) {
                case others_1.InputMetaKey:
                    var input = prop;
                    generator.Input(input.keyName, !input.isString);
                    break;
                case others_1.OutputMetaKey:
                    generator.Output(prop);
                    outputs.push(prop);
                    break;
                case others_1.OnMetaKey:
                    var on = prop;
                    generator.On(on.eventKey, proto[on.FuncName]);
                    break;
                case others_1.WatchMetaKey:
                    var watch = prop;
                    generator.Watch(watch.watchKey, proto[watch.FuncName]);
                    break;
            }
        });
    });
    return outputs;
}
//# sourceMappingURL=directive.js.map