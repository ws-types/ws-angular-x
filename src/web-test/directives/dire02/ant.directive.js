import {
    Directive, OnInit, OnDestroy, On, Input, Watch,
    Output, EventEmitter, $Injects, $Directive, Property,
    Require, Enumerable
} from "@angular";
import { AppService } from "@src/services/app.service";
import { Router } from "@angular/router";


@Directive({
    selector: "ant-directive",
    template: require("./ant.html"),
    restrict: "E",
    styles: [
        require("./ant.scss")
    ],
    mixin: true
})
export class AntDirective {

    @Input("newInput")
    @Enumerable()
    get inputMeta() { return this._input; }
    set inputMeta(value) { this._input = value; }

    @Output()
    @Enumerable()
    get onChanges() { return this._onchanges; }
    set onChanges(value) { this._onchanges = value; }

    @Require("ngModel")
    get ngModel() { return this._ngModel; };
    set ngModel(value) { this._ngModel = value; }

    static $injector() { return [AppService, "$scope", Router]; }

    constructor(app, $scope, router) {
        this.app = app;
        this.router = router;
        this.$scope = $scope;
        // console.log($scope);
        // console.log(this.inputMeta);
    }

    ngOnInit() {
        console.log("ant directive is on.");
        console.log(this);
        // console.log("directive init");
    }

    ngOnDestroy() {
        // console.log("directive destroyed");
    }

    @On("destroy")
    destroy(scope, attr, ele, ctrl) {
        // console.log("directive destroyed");
    }

    @Watch("inputMeta")
    watchInputMeta(scope, attr, ele, ctrl) {
        // console.log("inputMeta changes");
    }

    changes() {
        this.onChanges.emit("fuck : " + new Date().getTime().toString());
    }

}
