import { Directive } from "../../compilers/decoretors/directive";

@Directive({
    selector: "ng-child",
    template: `<ng-template ng-child></ng-template>`,
    restrict: "A",
    replace: true
})
export class NgxChildDirective {

}
