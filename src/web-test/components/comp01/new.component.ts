import {
    Component, OnInit, OnDestroy,
    ViewEncapsulation, Input, Output, EventEmitter,
    OnChanges, DoCheck, SimpleChanges
} from "@angular";
import { AppService } from "@src/services/app.service";

@Component({
    selector: "new-component",
    template: require("./new.html"),
    styles: [
        require("./new.scss")
    ]
})
export class NewComponent implements OnInit, OnDestroy, OnChanges {

    @Input(true)
    private metaTest: string;

    @Input()
    private metaNumber: number;

    @Output()
    private onKeyFuck: EventEmitter<string>;

    constructor(private app: AppService) {
        console.log(app);
    }

    ngOnInit(): void {
        console.log("component init");
    }

    ngOnDestroy(): void {
        console.log("component destroyed.");
    }

    ngOnChanges(changes: SimpleChanges): void {
        // for (const propName in changes) {
        //     if (propName) {
        //         console.log(`changes : ${propName}`);
        //     }
        // }
    }

    public changes() {
        this.onKeyFuck.emit(new Date().getTime().toString());
    }

}
