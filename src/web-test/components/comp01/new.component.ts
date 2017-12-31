import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from "@angular";

@Component({
    selector: "new-component",
    template: require("./new.html"),
    styles: [
        require("./new.scss")
    ]
})
export class NewComponent implements OnInit, OnDestroy {

    @Input(true)
    private metaTest: string;

    @Input()
    private metaNumber: number;

    @Output()
    private onKeyFuck: EventEmitter<string>;

    ngOnInit(): void {
        console.log("component init");
    }

    ngOnDestroy(): void {
        console.log("component destroyed.");
    }

    public changes() {
        this.onKeyFuck.emit(new Date().getTime().toString());
    }

}
