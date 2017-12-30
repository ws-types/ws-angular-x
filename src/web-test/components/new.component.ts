import { Component, OnInit, OnDestroy } from "@angular";


@Component({
    selector: "new-component",
    template: require("./new.html"),
    styles: [
        require("./new.scss")
    ]
})
export class NewComponent implements OnInit, OnDestroy {

    ngOnInit(): void {
        console.log("component init");
    }

    ngOnDestroy(): void {
        console.log("component destroyed.");
    }

}
