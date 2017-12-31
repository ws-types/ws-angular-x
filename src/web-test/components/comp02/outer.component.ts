import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular";
import { AppService } from "@src/services/app.service";


@Component({
    selector: "out-component",
    template: require("./outer.html"),
    styles: [
        require("./out.scss")
    ]
})
export class OutComponent implements OnInit, OnDestroy {

    public static $inject = ["appService", "$scope"];

    public data = {
        input: "abcdef",
        number: 123456
    };

    public show01 = true;

    public showDirective = true;

    public output: string;

    public direShow: string;

    constructor(private app: AppService) {
        console.log(app);
    }

    ngOnInit(): void {
        console.log("out component init");
    }

    ngOnDestroy(): void {
        console.log("out component destroyed.");
    }

    public changeChild() {
        this.show01 = !this.show01;
    }

    public changeDirective() {
        this.showDirective = !this.showDirective;
    }

    public onKeyFuck(output: string) {
        this.output = output;
        this.data.number = this.data.number + 1;
        this.data.input += "a";
    }

    public directiveChanges(changes: string) {
        this.direShow = changes;
    }

}
