import { ModuleGenerator, $Injects } from "@angular";
import { NgModule } from "@angular";
import { ComponentsModule } from "@src/components/component.module";
import { DirectivesModule } from "@src/directives/directive.module";
import { AppService } from "@src/services/app.service";
import { AnotherService } from "@src/services/another.service";
import { InjectorModule, InjectorService } from "@angular/core/injector";
import { BrowserAnimationsModule } from "@angular/core/animations";
import { Routes, RouterModule } from "@angular/router";

const rootRoutes: Routes = [
    { state: "index", path: "index", component: null },
    { state: "settings", path: "settings", loadChildren: "./../settings/settings.module#SettingsModule" },
    { path: "", redirectTo: "index", pathMatch: "full" },
    { path: "**", redirectTo: "errors.404", pathMatch: "full" }
];

@NgModule({
    imports: [
        InjectorModule,
        RouterModule.forRoot(rootRoutes),
        BrowserAnimationsModule,
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

    constructor() {
        console.log("app module created");
    }

}
