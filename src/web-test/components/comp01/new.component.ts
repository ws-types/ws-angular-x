import {
    Component, OnInit, OnDestroy,
    ViewEncapsulation, Input, Output, EventEmitter,
    OnChanges, DoCheck, SimpleChanges,
    IProviderClass, Require, Enumerable,
    Property, AfterViewInit, ViewChild, HTMLNgTemplate, TemplateRef
} from "@angular";

import { AppService } from "@src/services/app.service";
import { InjectorService } from "@angular/core/injector";
import { AnotherService } from "@src/services/another.service";
import { AntDirective } from "@src/directives/dire02/ant.directive";

import * as angular from "angular";

interface IThisScope extends ng.IScope, NewComponent {
    i18n: any;
}

@Component({
    selector: "new-component",
    mixin: true,
    templateUrl: "./new.html",
    styles: [
        require("./new.scss")
    ],
    i18n: true
})
export class NewComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

    @Input(true)
    private metaTest: string;

    @Input()
    private metaNumber: number;

    @Enumerable()
    public get AAA() { return this.metaNumber; }

    @Property("_bbb")
    public BBB: string;

    @Input()
    private ngModel: string;

    @Output()
    private onKeyFuck: EventEmitter<string>;

    @Require("antDirective")
    private outer: AntDirective;

    @Require("ngModel")
    private ngModelCtrl: ng.INgModelController;

    @ViewChild("testDom")
    private theTESTdom: TemplateRef<HTMLNgTemplate>;

    public isNGMD = false;

    constructor(
        private $scope: IThisScope,
        private $element: ng.IRootElementService,
        private app: AppService,
        private injector: InjectorService,
        private $timeout: ng.ITimeoutService) {

    }

    ngOnInit(): void {
        // console.log("new component init");
        // console.log(this);
        // console.log(this["i18n"]);
        // console.log(this["$scope"].i18n);
        if (this.ngModel) {
            this.isNGMD = true;
        }
        // console.log(this["$scope"]);
    }

    ngOnDestroy(): void {
        // console.log("component destroyed.");
    }

    ngOnChanges(changes: SimpleChanges): void {
        // for (const propName in changes) {
        //     if (propName) {
        //         console.log(`changes : ${propName}`);
        //     }
        // }
    }

    ngAfterViewInit(): void {
        // console.log(this.theTESTdom.nativeElement);
        if (!this.ngModelCtrl) {
            return;
        }
        this.ngModelCtrl.$render = () => {
            // console.log("$$render");
            // console.log($("#demoInput").html());
            $("#demoInput").html(this.ngModelCtrl.$viewValue || "");
        };
        this.ngModelCtrl.$formatters.push((value) => {
            console.log(value);
            return value + "_f";
        });
        this.ngModelCtrl.$parsers.push((value) => {
            console.log(value);
            return value + "_a";
        });
        this.$timeout(() => {
            // console.log(this.ngModel);
            $("#demoInput").html(this.ngModel);
            $("#demoInput").on("keyup", () => {
                this["$scope"].$evalAsync(() => this.read($("#demoInput")));
            });
            this.read($("#demoInput"));
        });
    }

    public changes() {
        this.onKeyFuck.emit(new Date().getTime().toString());
        console.log(this.app.router.RoutesConfig);
    }

    private read(element: JQuery<HTMLElement>) {
        let html = element.html();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        if (element[0].attributes.getNamedItem("stripBr") && html === "<br>") {
            html = "";
        }
        console.log(html);
        this.ngModelCtrl.$setViewValue(html || "");
    }

}
