import { Component, OnInit, OnDestroy, ViewEncapsulation, $Inject, $Injects } from "./../../../@angular";
import { AppService } from "@src/services/app.service";
import { AnotherService } from "@src/services/another.service";
import { Router } from "./../../../@angular/router";
import { Subscription } from "rxjs/Subscription";


@Component({
    selector: "out-component",
    template: require("./outer.html"),
    styles: [
        require("./out.scss")
    ]
})
export class OutComponent implements OnInit, OnDestroy {

    public static $inject = $Injects([AppService, "$scope", "@router"]);

    public data = {
        input: "abcdef",
        number: 123456
    };

    public show01 = true;

    public showDirective = true;

    public output: string;

    public direShow: string;

    private routerSubp: Subscription;

    constructor(private app, private scope, private router: Router) {
        // console.log(app);
        // console.log(state);
        this.routerSubp = router.params.subscribe(queryParams => {
            console.log(queryParams);
        });
    }

    ngOnInit(): void {
        console.log("out component init");
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
