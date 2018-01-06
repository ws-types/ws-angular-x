import { Directive, OnInit, OnDestroy, On, Input, Watch, Output, EventEmitter, $Injects, $Directive } from "./../../../@angular";
import { AppService } from "@src/services/app.service";
import { Router } from "./../../../@angular/router";


@Directive({
    selector: "ant-directive",
    template: require("./ant.html"),
    restrict: "E",
    styles: [
        require("./ant.scss")
    ]
})
export class AntDirective implements OnInit, OnDestroy {

    @Input()
    private inputMeta: string;

    @Output()
    private onChanges: EventEmitter<string>;

    public static $injector() { return [AppService, "$scope", Router]; }

    constructor(private app, private $scope, private router) {
        console.log($scope);
        console.log(router);
        // console.log(app);
        // console.log(scope);
    }

    ngOnInit(): void {
        console.log("ant directive is on.");
        // console.log("directive init");
    }

    ngOnDestroy(): void {
        // console.log("directive destroyed");
    }

    @On("destroy")
    public destroy(scope, attr, ele, ctrl) {
        // console.log("directive destroyed");
    }

    @Watch("inputMeta")
    public watchInputMeta(scope, attr, ele, ctrl) {
        // console.log("inputMeta changes");
    }

    public changes() {
        this.onChanges.emit("fuck : " + new Date().getTime().toString());
    }

}
