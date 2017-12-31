import { ModuleGenerator } from "@angular";
import { NgModule } from "@angular";
import { ComponentsModule } from "@src/components/component.module";
import { DirectivesModule } from "@src/directives/directive.module";

@NgModule({
    imports: [
        ComponentsModule,
        DirectivesModule
    ],
    declarations: [],
    providers: []
})
export class AppModule {

}
