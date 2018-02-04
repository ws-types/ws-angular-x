import {
    Component, OnInit, OnDestroy, ViewEncapsulation,
    $Inject, $Injects, ViewChild, HTMLNgTemplate,
    TemplateRef, AfterViewInit, Input, OnChanges,
    SimpleChanges, CompileService
} from "@angular";
import * as angular from "angular";

const $ng = angular.element;

@Component({
    selector: "test-tabs",
    template: `
    <div>
        <ng-template class="tabs-container"></ng-template>
    </div>
    `,
    alias: "__testTabsCtrl",
    styleUrls: [],
})
export class TabsComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

    @Input()
    private tabTemplate: TemplateRef<HTMLNgTemplate>;

    @Input()
    private tabsData: Array<{ title: string }>;

    constructor(private $scope, private compile: CompileService, private $element: ng.IRootElementService) {

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {
        console.log(this.tabTemplate);
    }

    ngOnChanges(changes: SimpleChanges): void {
        for (const prop in changes) {
            if (prop === "tabTemplate") {
                const current = changes[prop].currentValue;
                if (current) {
                    console.log(this.tabTemplate.nativeElement.outerHTML);
                    const container = this.$element.find(".tabs-container")[0];
                    const repeat = document.createElement("ng-template");
                    const v = this.tabTemplate.nativeElement.attributes.getNamedItem("let-model");
                    const letModel = (v && v.value) || "model";
                    $ng(repeat).attr("ng-repeat", `${letModel} in __testTabsCtrl.tabsData`);
                    repeat.appendChild(this.tabTemplate.nativeElement.cloneNode(true));
                    container.appendChild(repeat);
                    console.log(this.$scope);
                    $ng(container).replaceWith(this.compile.link(container, this["$scope"]));
                }
            }
        }
    }

}
