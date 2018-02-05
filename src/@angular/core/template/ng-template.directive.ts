import * as angular from "angular";
import { Directive, Component, Input } from "./../../compilers/decoretors";
import { IRefScope, ElementRef } from "./elementRef";
import { OnInit, OnChanges, SimpleChanges } from "./../../metadata/life-cycles";
import { CompileService } from "./../services/compile.service";


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

    constructor(private $element: ng.IRootElementService, private compile: CompileService) {

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
                    angular.extend(context, this.ngTemplateOutletContext);
                }
                const letModel = view.attributes.getNamedItem("let-model");
                if (letModel) {
                    context[letModel.value] = context["model"];
                }
                this.compile.link(<HTMLElement>this.$element[0].firstChild, context);
            }
        }
    }

}
