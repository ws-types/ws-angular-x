const loaderUtils = require("loader-utils");
const angularFilters = require("./filters");
const decamelize = require("decamelize");
const directives = angularFilters.directives;
const events = angularFilters.events;
const special = angularFilters.special;

function replace(filters, content) {
    filters.forEach(([regex, rValue]) => {
        content = content.replace(regex, rValue);
    });
    return content;
}

module.exports = function (content) {

    // tslint:disable-next-line:no-unused-expression
    this.cacheable && this.cacheable();

    let query;
    if (this.query) {
        query = loaderUtils.parseQuery(this.query);
    }

    let ctrl = "";
    if (query) {
        // ctrl = query.ctrl || "vm";
        ctrl = query.ctrl || "";
        if (ctrl === "$" && /<!--\[\$ngxCtrl:(.+)\]-->/.test(content)) {
            ctrl = RegExp.$1;
            content = content.replace(/<!--\[\$ngxCtrl:(.+)\]-->/, "");
        } else {
            // ctrl = "vm";
            ctrl = "";
        }
        if (ctrl) {
            ctrl += ".";
        }
    }

    const list01 = [];
    const list02 = [];
    const list03 = [];

    special.forEach(([key, value]) => {
        list03.push([new RegExp(`\\s${key}="\\s*([!]?)\\s*([^"]+)"`), value]);
    });

    events.forEach(([key, value]) => {
        list03.push([new RegExp(`\\s\\(${key}\\)="\\s*([!]?)\\s*([^"]+)"`), value]);
    });

    directives.forEach(([key, value]) => {
        list02.push([new RegExp(`\\s\\[${key}\\]="\\s*'([^']+)'\\s*"`), value]);
        list03.push([new RegExp(`\\s\\[${key}\\]="\\s*([!]?)\\s*([^"]+)\\s*"`), value]);
    });

    const regexBindings = />\s*{{{([^}<>]+)}}}\s*</;
    while (regexBindings.test(content)) {
        const value = RegExp.$1;
        content = content.replace(regexBindings, `>{{${ctrl}${value}}}<`);
    }

    // support for *ngFor.
    // example: * ngFor="let variable of ctrlList; let index = $index" => ng-repeat="variable in vm.ctrlList" ng-init="index = $index"
    const regexNgFor = /\s\*ngFor="\s*let\s+([a-zA-Z0-9_]+)\s*of\s*([a-zA-Z0-9_]+)\s*(;\s*let\s*[^"';]+)?"/;
    while (regexNgFor.test(content)) {
        const addVariables = RegExp.$3;
        let result = ` ng-repeat="${RegExp.$1} in ${ctrl}${RegExp.$2}"`;
        if (addVariables) {
            result += `ng-init="${addVariables.replace(/;\s*let/, "")}"`;
        }
        content = content.replace(regexNgFor, result);
    }

    list02.forEach(([regex, rp]) => {
        while (regex.test(content)) {
            const value = RegExp.$1;
            content = content.replace(regex, ` ${rp}="${value}"`);
        }
    });

    list03.forEach(([regex, rp]) => {
        while (regex.test(content)) {
            const value = RegExp.$2;
            const isNot = RegExp.$1 === "!";
            content = content.replace(regex, ` ${rp}="${isNot ? "!" : ""}${ctrl}${value}"`);
        }
    });

    const regexSimple = /\s[\[|\(]([^\s]+)[\]|\)]="\s*'([^']+)'\s*"/;
    while (regexSimple.test(content)) {
        const value = RegExp.$2;
        const directive = decamelize(RegExp.$1, "-");
        content = content.replace(regexSimple, ` ${directive}="${value}"`);
    }

    const regexSuppCtrl = /\s[\[|\(]([^\s]+)[\]|\)]="\s*([!]?)\s*([^"]+)\s*"/;
    while (regexSuppCtrl.test(content)) {
        const value = RegExp.$3;
        const isNot = RegExp.$2 === "!";
        const directive = decamelize(RegExp.$1, "-");
        content = content.replace(regexSuppCtrl, ` ${directive}="${isNot ? "!" : ""}${ctrl}${value}"`);
    }

    const regexTG = /\s[\[|\(]([^\s]+)[\]|\)]/;
    while (regexTG.test(content)) {
        const value = decamelize(RegExp.$1, "-");
        content = content.replace(regexTG, ` ${value}`);
    }

    // const ngxHashVariable = /<\s*[^"']*([^'"=]+=("|')[^"']*("|'))*#([0-9a-zA-Z_]+)\s*([^'"=]+=("|')[^"']*("|'))*(\/>|>)/;
    const ngxHashVariable = /<\s*([^"'=]+)\s+(([a-z\-]+="[^"]*"\s+)*)#([0-9a-zA-Z_]+)\s*(.*\/?)>/;
    while (ngxHashVariable.test(content)) {
        content = content.replace(ngxHashVariable, `<${RegExp.$1} ${RegExp.$2} ngx-name-selector="${RegExp.$4}" ${RegExp.$5}>`);
    }

    return content;
};
