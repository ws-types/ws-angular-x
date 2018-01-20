import * as decamelize from "decamelize";
import { ViewEncapsulation } from "../../metadata/enums";
import { Directive } from "../../compilers/decoretors/directive";
import { On, Input } from "../../compilers";
import { NgContentPrefix } from "../../compilers/parsers/template-parser";
import { AfterViewInit } from "../../metadata/life-cycles";

@Directive({
    selector: "ngx-expose",
    restrict: "A",
    isolate: false,
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
    ele.children().each((index, element) => parseNode(element, selector));
}

function parseNode(element: HTMLElement, selector: string) {
    const eleRoot = $(element);
    eleRoot.attr(selector, "");
    eleRoot.children().each((index, ele) => parseNode(ele, selector));
}
