import * as angular from "angular";
import * as parse5 from "parse5";
import { ViewEncapsulation } from "./../../metadata";
import { ElementRef } from "../../core/template/elementRef";

const $A = angular.element;
export const NgContentPrefix = "_ngcontent-v2";
export const NgHostPrefix = "_nghost-v2";

export interface ITemplateViewConfig {
    encapsulation?: ViewEncapsulation;
    selector: string;
    template?: string;
    useAST?: boolean;
    [propName: string]: any;
}

export class TemplateParser {

    private get type() { return this.config.encapsulation; }

    private template: string;
    private loaded_temp: HTMLElement;
    private config: ITemplateViewConfig;

    private ngxTemps: { [propName: string]: HTMLElement } = {};

    constructor(config?: ITemplateViewConfig) {
        this.config = config || { encapsulation: ViewEncapsulation.Emulated, selector: "", template: "" };
        this.template = this.config.template;
        if (!this.template) {
            return;
        }
        if (!this.config.useAST) { // not implemented.
            this.loaded_temp = this.parseTemplate(this.template, this.config.selector, this.type) || undefined;
        } else {
            this.loaded_temp = this.parseTemplate(this.template, this.config.selector, this.type) || undefined;
        }
    }

    public GetNgTemplate(selector: string) {
        if (this.ngxTemps[selector]) {
            this.ngxTemps[selector].parentElement.removeChild(this.ngxTemps[selector]);
        }
        return new ElementRef<any>(this.ngxTemps[selector]);
    }

    public Parse(): string {
        return !this.template ? undefined : (this.loaded_temp.innerHTML || undefined);
    }

    private parseTemplate(tpl: string, selector: string, type: ViewEncapsulation) {
        const ngTpl = document.createElement("ng-template");
        ngTpl.innerHTML = tpl || "";
        if (type === ViewEncapsulation.None) {
            return ngTpl;
        } else if (!tpl) {
            return ngTpl;
        }
        angular.forEach($A(ngTpl).children(), (element, index) => this.parseNode(element, selector));
        return ngTpl;
    }

    private parseNode(element: HTMLElement, selector: string) {
        const eleRoot = $A(element);
        eleRoot.attr(`${NgContentPrefix}-${selector}`, "");
        const childPayload = eleRoot.attr("ngx-child");
        if (childPayload === "") {
            eleRoot.attr("ngx-child", element.tagName.toLowerCase());
        }
        if (element.tagName === "NG-TEMPLATE" && eleRoot.attr("ngx-name-selector")) {
            this.ngxTemps[eleRoot.attr("ngx-name-selector")] = element;
        }
        angular.forEach(eleRoot.children(), (ele, index) => this.parseNode(ele, selector));
    }

}
