"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("angular");
var enums_1 = require("./../../metadata/enums");
var metadata_1 = require("./../../metadata");
var template_parser_1 = require("./template-parser");
var $A = angular.element;
var NgClassPrefix = template_parser_1.NgContentPrefix;
var NgClassSheet = "stylesheet";
var ngCover = /^::ng[x]?-cover(\[([^\s]+)\])?\s/;
var ngGlobal = /\s::ng[x]?-global/;
var ngHost = /^:host\s*/;
var ngDeep = /::ng-deep\s*/;
var CssParser = /** @class */ (function () {
    function CssParser(config) {
        var _this = this;
        this.classes = [];
        this.parsed_csses = [];
        this.config = config || { encapsulation: enums_1.ViewEncapsulation.Emulated, selector: "", styles: [] };
        this.classes = this.config.styles || (!this.config.style ? [] : [this.config.style]);
        this.classes.forEach(function (i, index) { return _this.parsed_csses.push(_this.parseCss(angular.copy(i), index)); });
    }
    Object.defineProperty(CssParser.prototype, "type", {
        get: function () { return this.config.encapsulation; },
        enumerable: true,
        configurable: true
    });
    CssParser.prototype.Parse = function () {
        var _this = this;
        return function () {
            _this.parsed_csses.forEach(function (css, index) { return loadCss(css, index, _this.config.selector); });
        };
    };
    CssParser.prototype.Dispose = function () {
        var _this = this;
        return function () {
            _this.parsed_csses.forEach(function (css, index) { return unloadCss(index, _this.config.selector); });
        };
    };
    CssParser.prototype.parseCss = function (css, index) {
        var _this = this;
        var selector = this.config.selector;
        var type = this.config.encapsulation;
        var attr_selector = createAttrSelector(selector);
        var host_selector = createHostSelector(selector);
        this.controlRules(css, attr_selector, host_selector);
        (css.rules || []).filter(function (i) { return i.type === metadata_1.CssContentType.Media; }).forEach(function (media) { return _this.controlRules(media, attr_selector, host_selector); });
        return cssToString(css, true, true);
    };
    CssParser.prototype.controlRules = function (target, attr_selector, host_selector) {
        var _this = this;
        (target.rules || []).filter(function (i) { return i.type === metadata_1.CssContentType.Rule; }).forEach(function (rule) {
            _this.parseRule(rule, attr_selector, host_selector);
        });
    };
    CssParser.prototype.parseRule = function (rule, attr_selector, host_selector) {
        var selector = this.config.selector;
        var type = this.config.encapsulation;
        var key = (rule.selectors || [])[0] || "";
        if (!key) {
            return;
        }
        var item = "" + key + attr_selector;
        var important = false;
        if (ngHost.test(key)) {
            (_a = hostCssParse(key, item, host_selector, attr_selector), item = _a.item, important = _a.important);
        }
        else {
            (_b = contentCssParse(type, item, key, selector), item = _b.item, important = _b.important);
        }
        rule.selectors = [item];
        (rule.declarations || []).filter(function (i) { return i.type === metadata_1.CssContentType.Declaration; }).forEach(function (declare) {
            if (important) {
                declare.value = declare.value + " !important";
            }
        });
        var _a, _b;
    };
    return CssParser;
}());
exports.CssParser = CssParser;
function createHostSelector(selector) {
    return "[" + template_parser_1.NgHostPrefix + "-" + selector + "]";
}
function createAttrSelector(selector) {
    return "[" + NgClassPrefix + "-" + selector + "]";
}
function cssToString(css, media, keyframes) {
    if (media === void 0) { media = false; }
    if (keyframes === void 0) { keyframes = false; }
    var result = cssRuleToString(css);
    if (media) {
        css.rules.filter(function (i) { return i.type === metadata_1.CssContentType.Media; }).forEach(function (md) {
            result += cssRuleToString(md, 2, "@media" + md.media + " {\n\n", "}\n\n");
        });
    }
    if (keyframes) {
        css.rules.filter(function (i) { return i.type === metadata_1.CssContentType.Keyframes; }).forEach(function (md) {
            result += cssKeyframesToString(md, 2, "@keyframes " + md.name + " {\n\n", "}\n\n");
        });
    }
    return result;
}
function cssRuleToString(css, tabs, startStr, endStr) {
    if (tabs === void 0) { tabs = 1; }
    if (startStr === void 0) { startStr = ""; }
    if (endStr === void 0) { endStr = ""; }
    var tbs = [];
    for (var i = 0; i < tabs; i++) {
        tbs.push("\t");
    }
    var stbs = tbs.slice(1) || [];
    var result = "" + startStr;
    (css.rules || []).filter(function (i) { return i.type === metadata_1.CssContentType.Rule; }).forEach(function (rule) {
        var each = "" + stbs.join("") + rule.selectors[0] + " {";
        (rule.declarations || []).filter(function (i) { return i.type === metadata_1.CssContentType.Declaration; }).forEach(function (declare) { return each += "\n" + tbs.join("") + declare.property + ":" + declare.value + ";"; });
        each += "\n" + stbs.join("") + "}\n\n";
        result += each;
    });
    result += endStr;
    return result;
}
function cssKeyframesToString(css, tabs, startStr, endStr) {
    if (tabs === void 0) { tabs = 1; }
    if (startStr === void 0) { startStr = ""; }
    if (endStr === void 0) { endStr = ""; }
    var tbs = [];
    for (var i = 0; i < tabs; i++) {
        tbs.push("\t");
    }
    var stbs = tbs.slice(1) || [];
    var result = "" + startStr;
    (css.keyframes || []).filter(function (i) { return i.type === metadata_1.CssContentType.Keyframe; }).forEach(function (rule) {
        var each = "" + stbs.join("") + rule.values.join(",") + " {";
        (rule.declarations || []).filter(function (i) { return i.type === metadata_1.CssContentType.Declaration; }).forEach(function (declare) { return each += "\n" + tbs.join("") + declare.property + ":" + declare.value + ";"; });
        each += "\n" + stbs.join("") + "}\n\n";
        result += each;
    });
    result += endStr;
    return result;
}
function contentCssParse(type, item, key, selector) {
    var important = false;
    if (type === enums_1.ViewEncapsulation.None) {
        item = "" + key;
    }
    else if (ngGlobal.test(key)) {
        item = "" + key.replace(ngGlobal, "").replace(ngCover, "");
    }
    else if (ngCover.test(key)) {
        item = "" + key.replace(ngCover, RegExp.$1 ? "[ngx-child=\"" + RegExp.$2 + "\"] " : selector + " ");
        important = true;
    }
    else if (ngDeep.test(key)) {
        item = "" + key.replace(ngDeep, "");
        important = true;
    }
    return { item: item, important: important };
}
function hostCssParse(key, item, host_selector, attr_selector) {
    var important = false;
    if (ngDeep.test(key)) {
        item = "" + key.replace(ngDeep, "").replace(ngHost, host_selector + " ");
        important = true;
    }
    else {
        var result = key.replace(ngHost, host_selector + " ");
        item = "" + result + (key.replace(ngHost, "").trim() === "" ? "" : attr_selector);
    }
    return { item: item, important: important };
}
function loadCss(css, index, selector) {
    var styleNode = $A(document.querySelector("[" + NgClassPrefix + "-" + selector + "-" + NgClassSheet + "='" + index + "']"))[0];
    if (!styleNode) {
        var node = document.createElement("style");
        node.innerHTML = css;
        $A(node).attr(NgClassPrefix + "-" + selector + "-" + NgClassSheet, index);
        $A(node).attr("_ngcount", 1);
        document.getElementsByTagName("head")[0].appendChild(node);
    }
    else {
        $A(styleNode).attr("_ngcount", parseInt($A(styleNode).attr("_ngcount"), 10) + 1);
    }
}
function unloadCss(index, selector) {
    setTimeout(function () {
        var styleNode = $A(document.querySelector("[" + NgClassPrefix + "-" + selector + "-" + NgClassSheet + "='" + index + "']"))[0];
        if (styleNode) {
            var nowCount = parseInt($A(styleNode).attr("_ngcount"), 10);
            if (nowCount > 1) {
                $A(styleNode).attr("_ngcount", nowCount - 1);
            }
            else {
                document.getElementsByTagName("head")[0].removeChild(styleNode);
            }
        }
    });
}
//# sourceMappingURL=css-parser.js.map