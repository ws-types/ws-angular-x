import * as angular from "angular";
import { ViewEncapsulation } from "./../../metadata/enums";
import { CssOnject } from "./../../metadata";
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
    styles?: CssOnject[];
    style?: CssOnject;
    [propName: string]: any;
}

export class CssParser {

    private get type() { return this.config.encapsulation; }

    private classes: CssOnject[] = [];
    private parsed_csses: string[] = [];
    private config: ICssViewConfig;

    constructor(config: ICssViewConfig) {
        this.config = config || { encapsulation: ViewEncapsulation.Emulated, selector: "", styles: [] };
        this.classes = this.config.styles || (!this.config.style ? [] : [this.config.style]);
        this.classes.forEach((i, index) => this.parsed_csses.push(parseCss(i, index, this.config.selector, this.type)));
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

}

function parseCss(css: CssOnject, index: number, selector: string, type: ViewEncapsulation) {
    const attr_selector = `[${NgClassPrefix}-${selector}]`;
    const host_selector = `[${NgHostPrefix}-${selector}]`;
    const maps = Object.keys(css);
    let str = "";
    maps.forEach(key => {
        let item = `${key}${attr_selector} {`;
        let important = false;
        if (ngHost.test(key)) {
            ({ item, important } = hostCssParse(key, item, host_selector, attr_selector));
        } else {
            ({ item, important } = contentCssParse(type, item, key, selector));
        }
        const content = css[key];
        const subKeys = Object.keys(content);
        subKeys.forEach(i => {
            const value = content[i];
            item += `\n\t${i}:${value}${important ? " !important" : ""};`;
        });
        item += "\n}\n\n";
        str += item;
    });
    return str;
}

function contentCssParse(type: ViewEncapsulation, item: string, key: string, selector: string) {
    let important = false;
    if (type === ViewEncapsulation.None) {
        item = `${key} {`;
    } else if (ngGlobal.test(key)) {
        item = `${key.replace(ngGlobal, "").replace(ngCover, "")} {`;
    } else if (ngCover.test(key)) {
        item = `${key.replace(ngCover, RegExp.$1 ? `[ngx-child="${RegExp.$2}"] ` : `${selector} `)} {`;
        important = true;
    }
    return { item, important };
}

function hostCssParse(key: string, item: string, host_selector: string, attr_selector: string) {
    let important = false;
    if (ngDeep.test(key)) {
        item = `${key.replace(ngDeep, "").replace(ngHost, `${host_selector} `)} {`;
        important = true;
    } else {
        const result = key.replace(ngHost, `${host_selector} `);
        item = `${result}${key.replace(ngHost, "").trim() === "" ? "" : attr_selector} {`;
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

