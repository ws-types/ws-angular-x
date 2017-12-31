import { Module } from "@angular/fluent";
import { ModuleGenerator } from "@angular";
import { NgModule } from "@angular";
import { ComponentsModule } from "@src/components/component.module";
import { DirectivesModule } from "@src/directives/directive.module";

// export const AppModule = Module({
//     selector: "app-module",
//     imports: [],
//     declarations: [],
//     providers: []
// });

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
