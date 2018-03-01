"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("angular");
var metadata_1 = require("./../../metadata");
var elementRef_1 = require("../../core/template/elementRef");
var $A = angular.element;
exports.NgContentPrefix = "_ngcontent-v2";
exports.NgHostPrefix = "_nghost-v2";
var TemplateParser = /** @class */ (function () {
    function TemplateParser(config) {
        this.ngxTemps = {};
        this.config = config || { encapsulation: metadata_1.ViewEncapsulation.Emulated, selector: "", template: "" };
        this.template = this.config.template;
        if (!this.template) {
            return;
        }
        if (!this.config.useAST) {
            this.loaded_temp = this.parseTemplate(this.template, this.config.selector, this.type) || undefined;
        }
        else {
            this.loaded_temp = this.parseTemplate(this.template, this.config.selector, this.type) || undefined;
        }
    }
    Object.defineProperty(TemplateParser.prototype, "type", {
        get: function () { return this.config.encapsulation; },
        enumerable: true,
        configurable: true
    });
    TemplateParser.prototype.GetNgTemplate = function (selector) {
        if (this.ngxTemps[selector]) {
            this.ngxTemps[selector].parentElement.removeChild(this.ngxTemps[selector]);
        }
        return new elementRef_1.ElementRef(this.ngxTemps[selector]);
    };
    TemplateParser.prototype.Parse = function () {
        return !this.template ? undefined : (this.loaded_temp.innerHTML || undefined);
    };
    TemplateParser.prototype.parseTemplate = function (tpl, selector, type) {
        var _this = this;
        var ngTpl = document.createElement("ng-template");
        ngTpl.innerHTML = tpl || "";
        if (type === metadata_1.ViewEncapsulation.None) {
            return ngTpl;
        }
        else if (!tpl) {
            return ngTpl;
        }
        angular.forEach($A(ngTpl).children(), function (element, index) { return _this.parseNode(element, selector); });
        return ngTpl;
    };
    TemplateParser.prototype.parseNode = function (element, selector) {
        var _this = this;
        var eleRoot = $A(element);
        eleRoot.attr(exports.NgContentPrefix + "-" + selector, "");
        var childPayload = eleRoot.attr("ngx-child");
        if (childPayload === "") {
            eleRoot.attr("ngx-child", element.tagName.toLowerCase());
        }
        if (element.tagName === "NG-TEMPLATE" && eleRoot.attr("ngx-name-selector")) {
            this.ngxTemps[eleRoot.attr("ngx-name-selector")] = element;
        }
        angular.forEach(eleRoot.children(), function (ele, index) { return _this.parseNode(ele, selector); });
    };
    return TemplateParser;
}());
exports.TemplateParser = TemplateParser;
//# sourceMappingURL=template-parser.js.map