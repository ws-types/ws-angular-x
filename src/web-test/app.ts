import { ModuleGenerator } from "@angular";
import { NgModule } from "@angular";
import { ComponentsModule } from "@src/components/component.module";
import { DirectivesModule } from "@src/directives/directive.module";
import { AppService } from "@src/services/app.service";
import { AnotherService } from "@src/services/another.service";
import { InjectorService } from "@angular/core/injector";

@NgModule({
    imports: [
        ComponentsModule,
        DirectivesModule
    ],
    declarations: [],
    providers: [
        InjectorService,
        AppService,
        AnotherService
    ]
})
export class AppModule {

    // constructor(private injector: InjectorService) {
    //     console.log(injector);
    // }

}
