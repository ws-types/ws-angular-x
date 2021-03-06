import { Component, OnInit, OnDestroy, ViewEncapsulation, $Inject, $Injects } from "@angular";
import { AppService } from "@src/services/app.service";
import { AnotherService } from "@src/services/another.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";


@Component({
    selector: "out-component",
    templateUrl: "./outer.html",
    styleUrls: [
        "./out.scss",
        "./out2.scss"
    ],
    mixin: true
})
export class OutComponent implements OnInit, OnDestroy {

    public static $inject = $Injects([AppService, "$scope", "@router"]);

    public data = {
        input: "abcdef",
        number: 123456
    };

    public Lists = ["aaa", "bbb", "ccc"];

    public message = "MESSAGE_AAAA";

    public modelString = "default-value";
    public get ModelString() { return this.modelString; }
    public set ModelString(value: string) { this.modelString = value; }

    public show01 = true;

    public showDirective = true;

    public output: string;

    public direShow: string;

    private routerSubp: Subscription;

    constructor(private app, private scope, private router: Router) {
        this.routerSubp = router.stateChanges.subscribe(state => {
            // console.log(state.to.name);
        });
    }

    ngOnInit(): void {
        console.log("out component init");
        // console.log(this.scope);
    }

    ngOnDestroy(): void {
        this.routerSubp.unsubscribe();
        // console.log("out component destroyed.");
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
