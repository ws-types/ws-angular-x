import { Directive, OnInit, OnDestroy, On, Input, Watch, Output, EventEmitter, $Injects, $Directive } from "@angular";
import { AppService } from "@src/services/app.service";
import { Router } from "@angular/router";


@Directive({
    selector: "ant-directive",
    template: require("./ant.html"),
    restrict: "E",
    styles: [
        require("./ant.scss")
    ]
})
export class AntDirective {

    @Input("newInput")
    get inputMeta() { return this._input; }
    set inputMeta(value) { this._input = value; }

    @Output()
    get onChanges() { return this._onchanges; }
    set onChanges(value) { this._onchanges = value; }

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
