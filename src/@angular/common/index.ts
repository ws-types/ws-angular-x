import { NgModule } from "./../compilers";
import { NgxExposeDirective } from "./directives/ngx-expose.directive";
import { CompileService } from "@angular/common/services/compile.service";

@NgModule({
    declarations: [
        NgxExposeDirective,
    ],
    providers: [
        CompileService
    ]
})
export class CommonModule {

}

