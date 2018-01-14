import { Component, OnDestroy } from "@angular";


@Component({
    selector: "lazy-a-component",
    template: `<div>AAAAAAAAAAAAAA<new-component></new-component></div>`,
    styles: []
})
export class LazyAComponent implements OnDestroy {

    ngOnDestroy(): void {
        console.log(this);
    }

}
