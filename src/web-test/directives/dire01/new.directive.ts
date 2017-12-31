import { Directive, OnInit, OnDestroy, On, Input, Watch } from "@angular";


@Directive({
    selector: "new-directive",
    template: require("./new.html"),
    isolate: true,
    restrict: "A",
    styles: [
        require("./new.scss")
    ]
})
export class NewDirective implements OnInit {

    @Input()
    private inputMeta: string;

    ngOnInit(): void {
        console.log("directive init");
    }

    // ngOnDestroy(): void {
    //     console.log("directive destroyed");
    // }

    @On("destroy")
    public destroy(scope, attr, ele) {
        console.log("directive destroyed");
    }

    @Watch("inputMeta")
    public watchInputMeta(scope, attr, ele) {
        console.log("inputMeta changes");
    }

}
