import * as decamelize from "decamelize";
import { ViewEncapsulation } from "../../metadata/enums";
import { Directive } from "../../compilers/decoretors/directive";
import { On, Input } from "../../compilers";
import { NgContentPrefix } from "../../compilers/parsers/template-parser";

@Directive({
    selector: "ngx-expose",
    restrict: "A",
    isolate: false,
    transclude: false,
    bindingToController: false,
})
export class NgxExposeDirective {

    @On("ngxParse")
    public onParsed(scope, element: JQuery<HTMLElement>, attrs, ctrl) {
        const stamp = Object.keys(attrs).find(i => i.includes("ngcontentV2"));
        parseTemplate(element, decamelize(stamp.replace("ngcontentV2", ""), "-"));
    }

}

function parseTemplate(ele: JQuery<HTMLElement>, selector: string) {
    ele.children().each((index, element) => parseNode(element, selector));
}

function parseNode(element: HTMLElement, selector: string) {
    const eleRoot = $(element);
    eleRoot.attr(`${NgContentPrefix}-${selector}`, "");
    eleRoot.children().each((index, ele) => parseNode(ele, selector));
}
