const loaderUtils = require("loader-utils");
const angularFilters = require("./filters");
const decamelize = require("decamelize");
const directives: Array<[string, string]> = angularFilters.directives;
const events: Array<[string, string]> = angularFilters.events;
const special: Array<[string, string]> = angularFilters.special;

function replace(filters: [RegExp, string][], content: string) {
    filters.forEach(([regex, rValue]) => {
        content = content.replace(regex, rValue);
    });
    return content;
}

module.exports = function (content: string) {
    // tslint:disable-next-line:no-unused-expression
    this.cacheable && this.cacheable();

    let query;
    if (this.query) {
        query = loaderUtils.parseQuery(this.query);
    }

    let ctrl = "";
    if (query) {
        ctrl = query.ctrl || "vm";
        if (ctrl === "$" && /<!--\[\$ngxCtrl:(.+)\]-->/.test(content)) {
            ctrl = RegExp.$1;
            content = content.replace(/<!--\[\$ngxCtrl:(.+)\]-->/, "");
        } else {
            ctrl = "vm";
        }
        ctrl += ".";
    }

    const list01 = [];
    const list02 = [];
    const list03 = [];

    events.forEach(([key, value]) => {
        list03.push([new RegExp(`\\s\\(${key}\\)="\\s*([!]?)\\s*([^"]+)"`), value]);
    });

    directives.forEach(([key, value]) => {
        list02.push([new RegExp(`\\s\\[${key}\\]="\\s*'([^']+)'\\s*"`), value]);
        list03.push([new RegExp(`\\s\\[${key}\\]="\\s*([!]?)\\s*([^"]+)\\s*"`), value]);
    });

    special.forEach(([key, value]) => {
        list03.push([new RegExp(`\\s${key}="\\s*([!]?)\\s*([^"]+)"`), value]);
    });

    list02.forEach(([regex, rp]) => {
        while (regex.test(content)) {
            const value: string = RegExp.$1;
            content = content.replace(regex, ` ${rp}="${value}"`);
        }
    });

    list03.forEach(([regex, rp]) => {
        while (regex.test(content)) {
            const value: string = RegExp.$2;
            const isNot = RegExp.$1 === "!";
            content = content.replace(regex, ` ${rp}="${isNot ? "!" : ""}${ctrl}${value}"`);
        }
    });

    while (/\s[\[|\(]([^\s]+)[\]|\)]="\s*'([^']+)'\s*"/.test(content)) { // [testData]=" 'abcd' " => test-data="abcd"  (input param type is @)
        const value: string = RegExp.$2;
        const directive: string = decamelize(RegExp.$1, "-");
        content = content.replace(/\s[\[|\(]([^\s]+)[\]|\)]="\s*'([^']+)'\s*"/, ` ${directive}="${value}"`);
    }

    while (/\s[\[|\(]([^\s]+)[\]|\)]="\s*([!]?)\s*([^"]+)\s*"/.test(content)) {  // [testData]="!isValid" => test-data="!vm.isValid"  (support for ! )
        const value: string = RegExp.$3;
        const isNot = RegExp.$2 === "!";
        const directive: string = decamelize(RegExp.$1, "-");
        content = content.replace(/\s[\[|\(]([^\s]+)[\]|\)]="\s*([!]?)\s*([^"]+)\s*"/, ` ${directive}="${isNot ? "!" : ""}${ctrl}${value}"`);
    }

    while (/\s[\[|\(]([^\s]+)[\]|\)]/.test(content)) {  // [testData] => test-data
        const value: string = decamelize(RegExp.$1, "-");
        content = content.replace(/\s[\[|\(]([^\s]+)[\]|\)]/, ` ${value}`);
    }

    return content;
};
