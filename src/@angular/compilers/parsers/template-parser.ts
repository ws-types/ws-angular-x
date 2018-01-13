import * as $ from "jquery";
import { ViewEncapsulation } from "./../../metadata";

export const NgContentPrefix = "_ngcontent-v2";

export interface ITemplateViewConfig {
    encapsulation?: ViewEncapsulation;
    selector: string;
    template?: string;
    [propName: string]: any;
}

export class TemplateParser {

    private get type() { return this.config.encapsulation; }

    private template: string;
    private config: ITemplateViewConfig;

    constructor(config?: ITemplateViewConfig) {
        this.config = config || { encapsulation: ViewEncapsulation.Emulated, selector: "", template: "" };
        this.template = this.config.template;
    }

    public Parse(): string {
        return parseTemplate(this.template, this.config.selector, this.type) || undefined;
    }

}

function parseTemplate(tpl: string, selector: string, type: ViewEncapsulation) {
    if (type === ViewEncapsulation.None) {
        return tpl;
    } else if (!tpl) {
        return tpl;
    }
    const ngTpl = document.createElement("ng-template");
    ngTpl.innerHTML = tpl;
    $(ngTpl).children().each((index, element) => parseNode(element, selector));
    return ngTpl.innerHTML;
}

function parseNode(element: HTMLElement, selector: string) {
    const eleRoot = $(element);
    eleRoot.attr(`${NgContentPrefix}-${selector}`, "");
    const childPayload = eleRoot.attr("ngx-child");
    if (childPayload === "") {
        eleRoot.attr("ngx-child", element.tagName.toLowerCase());
    }
    eleRoot.children().each((index, ele) => parseNode(ele, selector));
}
