import * as angular from "angular";
import { ViewEncapsulation } from "./../../metadata/enums";
import { CssObject, CssContentType, CssRule, CssMedia, CssKeyframe } from "./../../metadata";
import { NgContentPrefix, NgHostPrefix } from "./template-parser";

const $A = angular.element;

const NgClassPrefix = NgContentPrefix;
const NgClassSheet = "stylesheet";

const ngCover = /^::ng[x]?-cover(\[([^\s]+)\])?\s/;
const ngGlobal = /\s::ng[x]?-global/;
const ngHost = /^:host\s*/;
const ngDeep = /::ng-deep\s*/;

export interface ICssViewConfig {
    encapsulation?: ViewEncapsulation;
    selector: string;
    styles?: Array<CssObject>;
    style?: CssObject;
    [propName: string]: any;
}

export class CssParser {

    private get type() { return this.config.encapsulation; }

    private classes: Array<CssObject> = [];
    private parsed_csses: string[] = [];
    private config: ICssViewConfig;

    constructor(config: ICssViewConfig) {
        this.config = config || { encapsulation: ViewEncapsulation.Emulated, selector: "", styles: [] };
        this.classes = this.config.styles || (!this.config.style ? [] : [this.config.style]);
        this.classes.forEach((i, index) => this.parsed_csses.push(this.parseCss(angular.copy(i), index)));
    }

    public Parse(): () => void {
        return () => {
            this.parsed_csses.forEach((css, index) => loadCss(css, index, this.config.selector));
        };
    }

    public Dispose(): () => void {
        return () => {
            this.parsed_csses.forEach((css, index) => unloadCss(index, this.config.selector));
        };
    }

    private parseCss(css: CssObject, index: number) {
        const selector = this.config.selector;
        const type = this.config.encapsulation;
        const attr_selector = createAttrSelector(selector);
        const host_selector = createHostSelector(selector);
        this.controlRules(css, attr_selector, host_selector);
        (css.rules || []).filter(i => i.type === CssContentType.Media).forEach(media => this.controlRules(media, attr_selector, host_selector));
        return cssToString(css, true, true);
    }

    private controlRules(target: { rules?: Array<CssRule> }, attr_selector: string, host_selector: string) {
        (target.rules || []).filter(i => i.type === CssContentType.Rule).forEach(rule => {
            this.parseRule(rule, attr_selector, host_selector);
        });
    }

    private parseRule(rule: CssRule, attr_selector: string, host_selector: string) {
        const selector = this.config.selector;
        const type = this.config.encapsulation;
        const key = (rule.selectors || [])[0] || "";
        if (!key) { return; }
        let item = `${key}${attr_selector}`;
        let important = false;
        if (ngHost.test(key)) {
            ({ item, important } = hostCssParse(key, item, host_selector, attr_selector));
        } else {
            ({ item, important } = contentCssParse(type, item, key, selector));
        }
        rule.selectors = [item];
        (rule.declarations || []).filter(i => i.type === CssContentType.Declaration).forEach(declare => {
            if (important) { declare.value = declare.value + " !important"; }
        });
    }

}

function createHostSelector(selector: string) {
    return `[${NgHostPrefix}-${selector}]`;
}

function createAttrSelector(selector: string) {
    return `[${NgClassPrefix}-${selector}]`;
}

function cssToString(css: CssObject, media = false, keyframes = false) {
    let result = cssRuleToString(css);
    if (media) {
        css.rules.filter(i => i.type === CssContentType.Media).forEach((md: CssMedia) => {
            result += cssRuleToString(md, 2, `@media${md.media} {\n\n`, "}\n\n");
        });
    }
    if (keyframes) {
        css.rules.filter(i => i.type === CssContentType.Keyframes).forEach((md: CssKeyframe) => {
            result += cssKeyframesToString(md, 2, `@keyframes ${md.name} {\n\n`, "}\n\n");
        });
    }
    return result;
}

function cssRuleToString(css: { rules?: Array<CssRule> }, tabs = 1, startStr = "", endStr = "") {
    const tbs = [];
    for (let i = 0; i < tabs; i++) { tbs.push("\t"); }
    const stbs = tbs.slice(1) || [];
    let result = "" + startStr;
    (css.rules || []).filter(i => i.type === CssContentType.Rule).forEach(rule => {
        let each = `${stbs.join("")}${rule.selectors[0]} {`;
        (rule.declarations || []).filter(i => i.type === CssContentType.Declaration).forEach(
            declare => each += `\n${tbs.join("")}${declare.property}:${declare.value};`);
        each += `\n${stbs.join("")}}\n\n`;
        result += each;
    });
    result += endStr;
    return result;
}

function cssKeyframesToString(css: CssKeyframe, tabs = 1, startStr = "", endStr = "") {
    const tbs = [];
    for (let i = 0; i < tabs; i++) { tbs.push("\t"); }
    const stbs = tbs.slice(1) || [];
    let result = "" + startStr;
    (css.keyframes || []).filter(i => i.type === CssContentType.Keyframe).forEach(rule => {
        let each = `${stbs.join("")}${rule.values.join(",")} {`;
        (rule.declarations || []).filter(i => i.type === CssContentType.Declaration).forEach(declare => each += `\n${tbs.join("")}${declare.property}:${declare.value};`);
        each += `\n${stbs.join("")}}\n\n`;
        result += each;
    });
    result += endStr;
    return result;
}

function contentCssParse(type: ViewEncapsulation, item: string, key: string, selector: string) {
    let important = false;
    if (type === ViewEncapsulation.None) {
        item = `${key}`;
    } else if (ngGlobal.test(key)) {
        item = `${key.replace(ngGlobal, "").replace(ngCover, "")}`;
    } else if (ngCover.test(key)) {
        item = `${key.replace(ngCover, RegExp.$1 ? `[ngx-child="${RegExp.$2}"] ` : `${selector} `)}`;
        important = true;
    } else if (ngDeep.test(key)) {
        item = `${key.replace(ngDeep, "")}`;
        important = true;
    }
    return { item, important };
}

function hostCssParse(key: string, item: string, host_selector: string, attr_selector: string) {
    let important = false;
    if (ngDeep.test(key)) {
        item = `${key.replace(ngDeep, "").replace(ngHost, `${host_selector} `)}`;
        important = true;
    } else {
        const result = key.replace(ngHost, `${host_selector} `);
        item = `${result}${key.replace(ngHost, "").trim() === "" ? "" : attr_selector}`;
    }
    return { item, important };
}

function loadCss(css: string, index: number, selector: string) {
    const styleNode = $A(document.querySelector(`[${NgClassPrefix}-${selector}-${NgClassSheet}='${index}']`))[0];
    if (!styleNode) {
        const node = document.createElement("style");
        node.innerHTML = css;
        $A(node).attr(`${NgClassPrefix}-${selector}-${NgClassSheet}`, index);
        $A(node).attr(`_ngcount`, 1);
        document.getElementsByTagName("head")[0].appendChild(node);
    } else {
        $A(styleNode).attr(`_ngcount`, parseInt($A(styleNode).attr("_ngcount"), 10) + 1);
    }
}

function unloadCss(index: number, selector: string) {
    setTimeout(() => {
        const styleNode = $A(document.querySelector(`[${NgClassPrefix}-${selector}-${NgClassSheet}='${index}']`))[0];
        if (styleNode) {
            const nowCount = parseInt($A(styleNode).attr("_ngcount"), 10);
            if (nowCount > 1) {
                $A(styleNode).attr(`_ngcount`, nowCount - 1);
            } else {
                document.getElementsByTagName("head")[0].removeChild(styleNode);
            }
        }
    });
}

