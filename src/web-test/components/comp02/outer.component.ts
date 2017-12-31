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
        number: 123456
    };

    public show01 = true;

    public output: string;

    ngOnInit(): void {
        console.log("out component init");
    }

    ngOnDestroy(): void {
        console.log("out component destroyed.");
    }

    public changeChild() {
        this.show01 = !this.show01;
    }

    public onKeyFuck(output: string) {
        this.output = output;
        this.data.number = this.data.number + 1;
    }

}
