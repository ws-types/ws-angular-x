"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require("jquery");
var enums_1 = require("@angular/metadata/enums");
var NgClassPrefix = "_ngcontent-v2";
var NgClassSheet = "stylesheet";
var CssParser = (function () {
    function CssParser(config) {
        var _this = this;
        this.classes = [];
        this.parsed_csses = [];
        this.config = config || { encapsulation: enums_1.ViewEncapsulation.Emulated, selector: "", styles: [] };
        this.classes = config.styles || (!config.style ? [] : [config.style]);
        this.classes.forEach(function (i) { return _this.parsed_csses.push(parseCss(i, _this.config.selector, _this.type)); });
    }
    Object.defineProperty(CssParser.prototype, "type", {
        get: function () { return this.config.encapsulation; },
        enumerable: true,
        configurable: true
    });
    CssParser.prototype.Parse = function () {
        var _this = this;
        return function () {
            _this.parsed_csses.forEach(function (css) { return loadCss(css, _this.config.selector); });
        };
    };
    return CssParser;
}());
exports.CssParser = CssParser;
function parseCss(css, selector, type) {
    var attr_selector = "[" + NgClassPrefix + "-" + selector + "]";
    if (type === enums_1.ViewEncapsulation.None) {
        attr_selector = "";
    }
    var maps = Object.keys(css);
    var str = "";
    maps.forEach(function (key) {
        var item = "" + key + attr_selector + " {";
        if (key.includes(" ::ng-global")) {
            item = key.replace(" ::ng-global", "") + " {";
        }
        var content = css[key];
        var subKeys = Object.keys(content);
        subKeys.forEach(function (i) {
            var value = content[i];
            item += i + ":" + value + ";";
        });
        item += "}";
        str += item;
    });
    return str;
}
function loadCss(css, selector) {
    var styleNode = $("[" + NgClassPrefix + "-" + selector + "-" + NgClassSheet + "='']").get(0);
    if (!styleNode) {
        var node = document.createElement("style");
        node.innerHTML = css;
        $(node).attr(NgClassPrefix + "-" + selector + "-" + NgClassSheet, "");
        $("head").get(0).appendChild(node);
    }
}
//# sourceMappingURL=css-parser.js.map