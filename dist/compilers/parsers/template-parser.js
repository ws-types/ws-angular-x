"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var metadata_1 = require("./../../metadata");
var NgContentPrefix = "_ngcontent-v2";
var TemplateParser = (function () {
    function TemplateParser(config) {
        this.config = config || { encapsulation: metadata_1.ViewEncapsulation.Emulated, selector: "", template: "" };
        this.template = config.template;
    }
    Object.defineProperty(TemplateParser.prototype, "type", {
        get: function () { return this.config.encapsulation; },
        enumerable: true,
        configurable: true
    });
    TemplateParser.prototype.Parse = function () {
        return parseTemplate(this.template, this.config.selector, this.type);
    };
    return TemplateParser;
}());
exports.TemplateParser = TemplateParser;
function parseTemplate(tpl, selector, type) {
    if (type === metadata_1.ViewEncapsulation.None) {
        return tpl;
    }
    var ngTpl = document.createElement("ng-template");
    ngTpl.innerHTML = tpl;
    $(ngTpl).children().each(function (index, element) { return parseNode(element, selector); });
    return ngTpl.innerHTML;
}
function parseNode(element, selector) {
    $(element).attr(NgContentPrefix + "-" + selector, "");
    $(element).children().each(function (index, ele) { return parseNode(ele, selector); });
}
//# sourceMappingURL=template-parser.js.map