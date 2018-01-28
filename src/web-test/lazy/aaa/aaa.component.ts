import { Component, OnDestroy, OnInit } from "@angular";
import { Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";


@Component({
    selector: "lazy-a-component",
    template: `
    <div>
        <p>AAAAAAAAAAAAAA [ <span>{{vm.a}}</span> ] - [ <span>{{vm.b}}</span> ] </p>
    </div>`,
    styles: []
})
export class LazyAComponent implements OnInit, OnDestroy {

    public a: string;
    public b: string;
    private subp: Subscription;

    constructor(private router: Router) {

    }

    ngOnInit(): void {
        this.subp = this.router.stateChanges.subscribe(bundle => {
            this.a = bundle.params.a;
            this.b = bundle.params.b;
        });
    }

    ngOnDestroy(): void {
        this.subp.unsubscribe();
    }

}
