import {
    Component, OnInit, OnDestroy, ViewEncapsulation,
    $Inject, $Injects, ViewChild, HTMLNgTemplate,
    TemplateRef, AfterViewInit, Input, OnChanges,
    SimpleChanges, CompileService, ElementRef
} from "@angular";
import * as angular from "angular";

const $ng = angular.element;

@Component({
    selector: "test-container",
    template: `<div ng-transclude></div>`,
    alias: "vm",
    styleUrls: [],
})
export class ContainerComponent implements OnInit, OnDestroy, AfterViewInit {

    constructor(private $scope, private compile: CompileService, private $element: ng.IRootElementService) {

    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {

    }

}
