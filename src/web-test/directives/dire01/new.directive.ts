import { Directive, OnInit, OnDestroy, On, Input, Watch, Output, EventEmitter, $Injects, $Directive, AfterViewInit, Require } from "@angular";
import { AppService } from "@src/services/app.service";


@Directive({
    selector: "new-directive",
    template: require("./new.html"),
    restrict: "A",
    styles: [
        require("./new.scss")
    ],
    mixin: true
})
export class NewDirective implements OnInit, OnDestroy, AfterViewInit {

    @Input()
    private inputMeta: string;

    @Output()
    private onChanges: EventEmitter<string>;

    @Require("outComponent")
    private outer: any;

    constructor(private app: AppService, private $scope, private $element: JQuery<HTMLElement>) {
        // console.log(app);
        // console.log($scope);
        // console.log($element);
    }

    ngOnInit(): void {
        // console.log("directive init");
    }

    ngOnDestroy(): void {
        // console.log("directive destroyed");
    }

    ngAfterViewInit(): void {

    }

    @On("init")
    public init(scope, ele, attr, ctrl) {
        // console.log(attr);
    }

    @On("destroy")
    public destroy(scope, ele, attr, ctrl) {
        // console.log("directive destroyed");
    }

    @Watch("inputMeta")
    public watchInputMeta(scope, ele, attr, ctrl) {
        // console.log("inputMeta changes");
    }

    public changes() {
        this.inputMeta = new Date().getTime().toString();
        this.onChanges.emit("fuck : " + new Date().getTime().toString());
    }

}
