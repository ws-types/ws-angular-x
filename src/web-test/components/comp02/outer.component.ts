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

    ngOnInit(): void {
        console.log("out component init");
    }

    ngOnDestroy(): void {
        console.log("out component destroyed.");
    }

}
