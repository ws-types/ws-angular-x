import * as $ from "jquery";
import { ViewEncapsulation } from "@angular/metadata/enums";
import { CssOnject } from "@angular/metadata";

const NgClassPrefix = "_ngcontent-v2";
const NgClassSheet = "stylesheet";

export interface ICssViewConfig {
    encapsulation?: ViewEncapsulation;
    selector: string;
    [propName: string]: any;
}

export class CssParser {

    private classes: CssOnject[] = [];
    private parsed_csses: string[] = [];
    private config: ICssViewConfig;

    constructor(classes: CssOnject[], config?: ICssViewConfig) {
        this.config = config || { encapsulation: ViewEncapsulation.Emulated, selector: "" };
        this.classes = classes || [];
        this.classes.forEach(i => this.parsed_csses.push(parseCss(i, this.config.selector)));
    }

    public Parse(): () => void {
        return () => {
            this.parsed_csses.forEach(css => loadCss(css, this.config.selector));
        };
    }

}

function parseCss(css: CssOnject, selector: string) {
    const maps = Object.keys(css);
    let str = "";
    maps.forEach(key => {
        let item = `${key}[${NgClassPrefix}-${selector}] {`;
        const content = css[key];
        const subKeys = Object.keys(content);
        subKeys.forEach(i => {
            const value = content[i];
            item += `${i}:${value}`;
        });
        item += "}";
        str += item;
    });
    return str;
}

function loadCss(css: string, selector: string) {
    const styleNode = $(`[attribute='${NgClassPrefix}-${selector}-${NgClassSheet}']`).get(0);
    if (!styleNode) {
        const node = document.createElement("style");
        node.innerHTML = css;
        $(node).attr(`${NgClassPrefix}-${selector}-${NgClassSheet}`, "");
        $("head").get(0).appendChild(node);
    }
}

