import {
    Component, OnInit, OnDestroy,
    ViewEncapsulation, Input, Output, EventEmitter,
    OnChanges, DoCheck, SimpleChanges, IProviderClass, Require
} from "@angular";

import { AppService } from "@src/services/app.service";
import { InjectorService } from "@angular/core/injector";
import { AnotherService } from "@src/services/another.service";
import { AntDirective } from "@src/directives/dire02/ant.directive";

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

    @Require("antDirective")
    private outer: AntDirective;

    @Require("ngModel")
    private ngModel: ng.INgModelController;

    constructor(private app: AppService, private injector: InjectorService) {

    }

    ngOnInit(): void {
        console.log("new component init");
        console.log(this);
        // console.log(this.onKeyFuck({ $event: "hahahahahahah----666666" }));
    }

    ngOnDestroy(): void {
        // console.log("component destroyed.");
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
