import { Directive, OnInit, OnDestroy, On, Input, Watch, Output, EventEmitter, $Injects, $Directive } from "./../../../@angular";
import { AppService } from "@src/services/app.service";


@Directive({
    selector: "new-directive",
    template: require("./new.html"),
    restrict: "A",
    styles: [
        require("./new.scss")
    ]
})
export class NewDirective implements OnInit, OnDestroy {

    public static $inject = [AppService, "$scope"];

    @Input()
    private inputMeta: string;

    @Output()
    private onChanges: EventEmitter<string>;

    constructor(private app, private scope) {
        // console.log(app);
        // console.log(scope);
    }

    ngOnInit(): void {
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
