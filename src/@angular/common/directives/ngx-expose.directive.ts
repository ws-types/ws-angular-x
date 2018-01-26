import * as decamelize from "decamelize";
import * as angular from "angular";
import { ViewEncapsulation } from "../../metadata/enums";
import { Directive } from "../../compilers/decoretors/directive";
import { On, Input } from "../../compilers";
import { NgContentPrefix } from "../../compilers/parsers/template-parser";
import { AfterViewInit } from "../../metadata/life-cycles";

@Directive({
    selector: "ngx-expose",
    restrict: "A",
    alias: "__ngxExpose",
    isolate: false,
    merge: true,
    transclude: false,
    bindingToController: false,
})
export class NgxExposeDirective implements AfterViewInit {

    constructor(private $element: JQuery<HTMLElement>) {

    }

    ngAfterViewInit(): void {
        const attributes = this.$element[0].attributes;
        const attrs: Array<{ localName: string }> = [];
        Object.keys(attributes).forEach(key => attrs.push(attributes[key]));
        const lead = attrs.map(i => i.localName).find(i => i.includes(NgContentPrefix));
        if (lead) {
            parseTemplate(this.$element, lead);
        }
    }

}

function parseTemplate(ele: JQuery<HTMLElement>, selector: string) {
    angular.forEach(ele.children(), (element, index) => parseNode(element, selector));
}

function parseNode(element: HTMLElement, selector: string) {
    const eleRoot = angular.element(element);
    eleRoot.attr(selector, "");
    angular.forEach(eleRoot.children(), (ele, index) => parseNode(ele, selector));
}
