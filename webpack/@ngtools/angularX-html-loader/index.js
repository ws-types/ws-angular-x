var loaderUtils = require("loader-utils");
var angularFilters = require("./filters");
var decamelize = require("decamelize");
var directives = angularFilters.directives;
var events = angularFilters.events;
var special = angularFilters.special;
function replace(filters, content) {
    filters.forEach(function (_a) {
        var regex = _a[0], rValue = _a[1];
        content = content.replace(regex, rValue);
    });
    return content;
}
module.exports = function (content) {
    // tslint:disable-next-line:no-unused-expression
    this.cacheable && this.cacheable();
    var query;
    if (this.query) {
        query = loaderUtils.parseQuery(this.query);
    }
    var ctrl = "";
    if (query) {
        ctrl = query.ctrl || "vm";
        if (ctrl === "$" && /<!--\[\$ngxCtrl:(.+)\]-->/.test(content)) {
            ctrl = RegExp.$1;
            content = content.replace(/<!--\[\$ngxCtrl:(.+)\]-->/, "");
        }
        else {
            ctrl = "vm";
        }
        ctrl += ".";
    }
    // console.log(ctrl);
    // const ngEventFilterList: Array<[RegExp, string]> = [];
    // const ngDireBindingsList: Array<[RegExp, string]> = [];
    // const ngDiretivesList: Array<[RegExp, string]> = [];
    // const ngSpecialList: Array<[RegExp, string]> = [];
    var list01 = [];
    var list02 = [];
    var list03 = [];
    events.forEach(function (_a) {
        var key = _a[0], value = _a[1];
        list03.push([new RegExp("\\s\\(" + key + "\\)=\"\\s*([!]?)\\s*([^\"]+)\""), value]);
        // ngEventFilterList.push([new RegExp(`\\s\\(${key}\\)="\\s*'([^']+)'\\s*"`, "g"), ` ${value}="'`]);
        // ngEventFilterList.push([new RegExp(`\\s\\(${key}\\)="!?`, "g"), ` ${value}="!${ctrl}`]);
        // ngEventFilterList.push([new RegExp(`\\s\\(${key}\\)="\\s*([!]?)\\s*([^"]+)"`, "g"), ` ${value}="${ctrl}`]);
    });
    directives.forEach(function (_a) {
        var key = _a[0], value = _a[1];
        list02.push([new RegExp("\\s\\[" + key + "\\]=\"\\s*'([^']+)'\\s*\""), value]);
        list03.push([new RegExp("\\s\\[" + key + "\\]=\"\\s*([!]?)\\s*([^\"]+)\\s*\""), value]);
        // ngDireBindingsList.push([new RegExp(`\\s\\[${key}\\]="`, "g"), ` ${value}="${ctrl}`]);
        // ngDiretivesList.push([new RegExp(`\\s\\[${key}\\]\\s`, "g"), ` ${value} `]);
    });
    special.forEach(function (_a) {
        var key = _a[0], value = _a[1];
        list03.push([new RegExp("\\s" + key + "=\"\\s*([!]?)\\s*([^\"]+)\""), value]);
        // ngSpecialList.push([new RegExp(`\\s${key}="!`, "g"), ` ${value}="!${ctrl}`]);
        // ngSpecialList.push([new RegExp(`\\s${key}="`, "g"), ` ${value}="${ctrl}`]);
    });
    list02.forEach(function (_a) {
        var regex = _a[0], rp = _a[1];
        while (regex.test(content)) {
            var value = RegExp.$1;
            content = content.replace(regex, " " + rp + "=\"" + value + "\"");
        }
    });
    list03.forEach(function (_a) {
        var regex = _a[0], rp = _a[1];
        while (regex.test(content)) {
            var value = RegExp.$2;
            var isNot = RegExp.$1 === "!";
            content = content.replace(regex, " " + rp + "=\"" + (isNot ? "!" : "") + ctrl + value + "\"");
        }
    });
    // content = replace(ngSpecialList, content);
    // content = replace(ngEventFilterList, content);
    // content = replace(ngDireBindingsList, content);
    // content = replace(ngDiretivesList, content);
    while (/\s[\[|\(]([^\s]+)[\]|\)]="\s*'([^']+)'\s*"/.test(content)) {
        var value = RegExp.$2;
        var directive = decamelize(RegExp.$1, "-");
        content = content.replace(/\s[\[|\(]([^\s]+)[\]|\)]="\s*'([^']+)'\s*"/, " " + directive + "=\"" + value + "\"");
    }
    while (/\s[\[|\(]([^\s]+)[\]|\)]="\s*([!]?)\s*([^"]+)\s*"/.test(content)) {
        var value = RegExp.$3;
        var isNot = RegExp.$2 === "!";
        var directive = decamelize(RegExp.$1, "-");
        content = content.replace(/\s[\[|\(]([^\s]+)[\]|\)]="\s*([!]?)\s*([^"]+)\s*"/, " " + directive + "=\"" + (isNot ? "!" : "") + ctrl + value + "\"");
    }
    while (/\s[\[|\(]([^\s]+)[\]|\)]/.test(content)) {
        var value = decamelize(RegExp.$1, "-");
        content = content.replace(/\s[\[|\(]([^\s]+)[\]|\)]/, " " + value);
    }
    return content;
};
//# sourceMappingURL=index.js.map