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
var metadata_1 = require("./../../metadata");
var errors_1 = require("./../../utils/errors");
var DirectiveGenerator = (function (_super) {
    __extends(DirectiveGenerator, _super);
    function DirectiveGenerator(config) {
        var _this = _super.call(this, config) || this;
        _this.config = config;
        _this.onMaps = {};
        _this.watchMaps = {};
        if (!_this.config.bindingToController && _this.config.bindingToController !== false) {
            _this.config.bindingToController = true;
        }
        else {
            _this.config.bindingToController = false;
        }
        if (!_this.config.isolate && _this.config.isolate !== false) {
            _this.config.isolate = true;
        }
        else {
            _this.config.isolate = false;
            _this.config.bindingToController = false;
        }
        return _this;
    }
    Object.defineProperty(DirectiveGenerator.prototype, "Type", {
        get: function () { return metadata_1.GeneratorType.Directive; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DirectiveGenerator.prototype, "StylesLoad", {
        get: function () { return this._css.Parse(); },
        enumerable: true,
        configurable: true
    });
    DirectiveGenerator.prototype.Input = function (key, isObject) {
        if (isObject === void 0) { isObject = true; }
        if (!this.config.isolate) {
            throw errors_1.UnisolateScopeBindingError();
        }
        this._bindings[key] = isObject ? "=" : "@";
        return this;
    };
    DirectiveGenerator.prototype.Output = function (key) {
        if (!this.config.isolate) {
            throw errors_1.UnisolateScopeBindingError();
        }
        this._bindings[key] = "&";
        return this;
    };
    DirectiveGenerator.prototype.On = function (key, func) {
        this.onMaps[key] = func;
        return this;
    };
    DirectiveGenerator.prototype.Watch = function (key, func) {
        this.watchMaps[key] = func;
        return this;
    };
    DirectiveGenerator.prototype.Build = function () {
        var _this = this;
        var directive = function () {
            return {
                scope: _this.config.isolate ? _this._bindings : true,
                bindToController: _this.config.bindingToController,
                restrict: _this.config.restrict || "E",
                template: _this._tpl.Parse(),
                controller: _this._ctrl,
                controllerAs: _this.config.alias || "vm",
                replace: false,
                transclude: true,
                link: function (scope, attr, element, controller) {
                    if (_this.onMaps) {
                        Object.keys(_this.onMaps).forEach(function (name) {
                            scope.$on("$" + name, function () {
                                _this.onMaps[name](scope, attr, element, controller);
                            });
                        });
                    }
                    if (_this.watchMaps) {
                        Object.keys(_this.watchMaps).forEach(function (name) {
                            scope.$watch((_this.config.bindingToController ? (_this.config.alias || "vm") + "." : "") + name, function () {
                                _this.watchMaps[name](scope, attr, element, controller);
                            });
                        });
                    }
                }
            };
        };
        return directive;
    };
    return DirectiveGenerator;
}(component_1.BaseGenerator));
exports.DirectiveGenerator = DirectiveGenerator;
//# sourceMappingURL=directive.js.map