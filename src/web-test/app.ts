import { ModuleGenerator } from "@angular";
import { NgModule } from "@angular";
import { ComponentsModule } from "@src/components/component.module";
import { DirectivesModule } from "@src/directives/directive.module";
import { AppService } from "@src/services/app.service";
import { AnotherService } from "@src/services/another.service";
import { InjectorModule } from "@angular/core/injector";

@NgModule({
    imports: [
        InjectorModule,
        ComponentsModule,
        DirectivesModule
    ],
    declarations: [],
    providers: [
        AppService,
        AnotherService
    ]
})
export class AppModule {

}
