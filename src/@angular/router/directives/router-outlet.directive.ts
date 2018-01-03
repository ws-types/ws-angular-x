import { Directive } from "./../../compilers";


@Directive({
    selector: "router-outlet",
    template: `<ui-view></ui-view>`,
    isolate: false
})
export class RouterOutletDirective {

}
