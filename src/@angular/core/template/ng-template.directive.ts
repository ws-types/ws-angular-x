import * as angular from "angular";
import { Directive, Component, Input } from "./../../compilers/decoretors";
import { ElementRef } from "./elementRef";
import { OnInit, OnChanges, SimpleChanges } from "./../../metadata/life-cycles";
import { CompileService } from "./../services/compile.service";
import { IRefScope } from "./../../metadata";

const ngxContentPrefix = "__ngxContent_";

@Directive({
    selector: "ng-template-outlet",
    restrict: "A",
    alias: "__ngxTemplateOutletCtrl"
})
export class NgTemplateOutletDirective implements OnInit, OnChanges {

    @Input()
    private ngTemplateOutlet: ElementRef<any>;

    @Input()
    private ngTemplateOutletContext: IRefScope;

    constructor(private $element: ng.IRootElementService, private $attrs: ng.IAttributes, private compile: CompileService) {

    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        for (const key in changes) {
            if (key === "ngTemplateOutlet") {
                if (!this.ngTemplateOutlet) {
                    return;
                }
                this.$element.html("");
                const view: HTMLElement = this.ngTemplateOutlet.createView();
                this.$element[0].appendChild(view);
                const context = this.ngTemplateOutlet.createContext();
                if (this.ngTemplateOutletContext) {
                    const newContent = createNgxContent(this.ngTemplateOutletContext);
                    angular.extend(context, newContent);
                }
                const attrs = createAttrsList(view.attributes);
                attrs.filter(([name, value]) => name.includes("let-")).forEach(([name, value]) => {
                    context[value] = context[ngxContentPrefix + name.replace("let-", "")];
                });
                this.compile.link(<HTMLElement>this.$element[0].firstChild, context);
            }
        }
    }

}

function createAttrsMap(attrs: NamedNodeMap): { [prop: string]: string } {
    const maps = {};
    Object.keys(attrs).forEach(key => {
        const attr = attrs[key];
        maps[attr.localName] = attr.value;
    });
    return maps;
}

function createAttrsList(attrs: NamedNodeMap): Array<[string, string]> {
    const arr = [];
    Object.keys(attrs).forEach(key => {
        const attr = attrs[key];
        arr.push([attr.localName, attr.value]);
    });
    return arr;
}

function createNgxContent(scope: IRefScope): { [prop: string]: any } {
    const content = {};
    Object.keys(scope).forEach(key => {
        content[ngxContentPrefix + key] = scope[key];
    });
    return content;
}
