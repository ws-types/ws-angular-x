import * as $ from "jquery";
import { ViewEncapsulation } from "@angular/metadata";

const NgContentPrefix = "_ngcontent-v2";

export interface ITemplateViewConfig {
    encapsulation?: ViewEncapsulation;
    selector: string;
    [propName: string]: any;
}

export class TemplateParser {

    private get type() { return this.config.encapsulation; }

    private config: ITemplateViewConfig;

    constructor(private template: string, config?: ITemplateViewConfig) {
        this.config = config || { encapsulation: ViewEncapsulation.Emulated, selector: "" };
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
