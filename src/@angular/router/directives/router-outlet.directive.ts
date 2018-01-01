import { Directive } from "@angular";


@Directive({
    selector: "router-outlet",
    template: `<ui-view></ui-view>`,
    isolate: false
})
export class RouterOutletDirective {

}
