import * as $ from "jquery";
import { ViewEncapsulation } from "./../../metadata/enums";
import { CssOnject } from "./../../metadata";

const NgClassPrefix = "_ngcontent-v2";
const NgClassSheet = "stylesheet";

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
        this.classes.forEach(i => this.parsed_csses.push(parseCss(i, this.config.selector, this.type)));
    }

    public Parse(): () => void {
        return () => {
            this.parsed_csses.forEach(css => loadCss(css, this.config.selector));
        };
    }

}

function parseCss(css: CssOnject, selector: string, type: ViewEncapsulation) {
    let attr_selector = `[${NgClassPrefix}-${selector}]`;
    if (type === ViewEncapsulation.None) {
        attr_selector = "";
    }
    const maps = Object.keys(css);
    let str = "";
    maps.forEach(key => {
        let item = `${key}${attr_selector} {`;
        if (key.includes(" ::ng-global")) {
            item = `${key.replace(" ::ng-global", "")} {`;
        }
        const content = css[key];
        const subKeys = Object.keys(content);
        subKeys.forEach(i => {
            const value = content[i];
            item += `${i}:${value};`;
        });
        item += "}";
        str += item;
    });
    return str;
}

function loadCss(css: string, selector: string) {
    const styleNode = $(`[${NgClassPrefix}-${selector}-${NgClassSheet}='']`).get(0);
    if (!styleNode) {
        const node = document.createElement("style");
        node.innerHTML = css;
        $(node).attr(`${NgClassPrefix}-${selector}-${NgClassSheet}`, "");
        $("head").get(0).appendChild(node);
    }
}

