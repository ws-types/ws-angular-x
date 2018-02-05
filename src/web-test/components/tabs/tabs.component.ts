import {
    Component, OnInit, OnDestroy, ViewEncapsulation,
    $Inject, $Injects, ViewChild, HTMLNgTemplate,
    TemplateRef, AfterViewInit, Input, OnChanges,
    SimpleChanges, CompileService, ElementRef
} from "@angular";
import * as angular from "angular";

const $ng = angular.element;

@Component({
    selector: "test-tabs",
    template: `
    <div>
        <ng-template ng-repeat="row in __testTabsCtrl.tabsData">
            <ng-template ng-if="__testTabsCtrl.tabTemplate" ng-template-outlet="__testTabsCtrl.tabTemplate" ng-template-outlet-context="{model:row}"></ng-template>
        </ng-template>
    </div>
    `,
    alias: "__testTabsCtrl",
    styleUrls: [],
})
export class TabsComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input()
    private tabTemplate: ElementRef<HTMLNgTemplate>;

    @Input()
    private tabsData: Array<{ title: string }>;

    constructor(private $scope, private compile: CompileService, private $element: ng.IRootElementService) {

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

    }

}
