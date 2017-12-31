import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular";


@Component({
    selector: "out-component",
    template: require("./outer.html"),
    styles: [
        require("./out.scss")
    ],
    encapsulation: ViewEncapsulation.Emulated
})
export class OutComponent implements OnInit, OnDestroy {

    public data = {
        test: "hahahahaha",
        number: 123456
    };

    public output: string;

    ngOnInit(): void {
        console.log("out component init");
    }

    ngOnDestroy(): void {
        console.log("out component destroyed.");
    }

    public onKeyFuck(output: string) {
        this.output = output;
    }

}
