import * as $ from "jquery";
import { ViewEncapsulation } from "./../../metadata";

const NgContentPrefix = "_ngcontent-v2";

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
        return parseTemplate(this.template, this.config.selector, this.type);
    }

}

function parseTemplate(tpl: string, selector: string, type: ViewEncapsulation) {
    if (type === ViewEncapsulation.None) {
        return tpl;
    }
    const ngTpl = document.createElement("ng-template");
    ngTpl.innerHTML = tpl;
    $(ngTpl).children().each((index, element) => parseNode(element, selector));
    return ngTpl.innerHTML;
}

function parseNode(element: HTMLElement, selector: string) {
    $(element).attr(`${NgContentPrefix}-${selector}`, "");
    $(element).children().each((index, ele) => parseNode(ele, selector));
}
