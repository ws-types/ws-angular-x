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
var selector_parser_1 = require("../parsers/selector-parser");
var template_parser_1 = require("../parsers/template-parser");
var css_parser_1 = require("../parsers/css-parser");
var metadata_1 = require("./../../metadata");
var BaseGenerator = /** @class */ (function () {
    function BaseGenerator(config) {
        this.config = config;
        this._bindings = {};
        this._requires = {};
        this._viewChilds = [];
        this._tpl = new template_parser_1.TemplateParser(config);
        this._css = new css_parser_1.CssParser(config);
    }
    Object.defineProperty(BaseGenerator.prototype, "Selector", {
        get: function () { return selector_parser_1.SelectorParse(this.config.selector); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseGenerator.prototype, "Type", {
        get: function () { return metadata_1.GeneratorType.None; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseGenerator.prototype, "ViewChildren", {
        get: function () { return this._viewChilds; },
        enumerable: true,
        configurable: true
    });
    BaseGenerator.prototype.Class = function (controller) {
        this._ctrl = controller;
        return this;
    };
    BaseGenerator.prototype.Input = function (key, alias, isString, isTwoWay) {
        if (isString === void 0) { isString = false; }
        if (isTwoWay === void 0) { isTwoWay = false; }
        this._bindings[key] = "" + (!isString ? isTwoWay ? "=" : "<" : "@") + (alias || "");
        return this;
    };
    BaseGenerator.prototype.Output = function (key) {
        this._bindings[key] = "&";
        return this;
    };
    BaseGenerator.prototype.Require = function (require, propName, scope, strict) {
        this._requires[propName] = "" + strict + scope + require;
        return this;
    };
    BaseGenerator.prototype.ViewChild = function (tempName, keyName) {
        this._viewChilds.push([keyName, this._tpl.GetNgTemplate(tempName)]);
        return this;
    };
    return BaseGenerator;
}());
exports.BaseGenerator = BaseGenerator;
var ComponentGenerator = /** @class */ (function (_super) {
    __extends(ComponentGenerator, _super);
    function ComponentGenerator(config) {
        var _this = _super.call(this, config) || this;
        _this.config = config;
        _this._bindings = {};
        return _this;
    }
    Object.defineProperty(ComponentGenerator.prototype, "Type", {
        get: function () { return metadata_1.GeneratorType.Component; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentGenerator.prototype, "StylesLoad", {
        get: function () { return this._css.Parse(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentGenerator.prototype, "StylesUnload", {
        get: function () { return this._css.Dispose(); },
        enumerable: true,
        configurable: true
    });
    ComponentGenerator.prototype.Build = function () {
        var component = {
            bindings: this._bindings,
            controller: this._ctrl,
            controllerAs: this.config.alias || "vm",
            template: this._tpl.Parse(),
            require: this._requires,
            transclude: true
        };
        return component;
    };
    return ComponentGenerator;
}(BaseGenerator));
exports.ComponentGenerator = ComponentGenerator;
//# sourceMappingURL=component.js.map