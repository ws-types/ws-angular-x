import { ModuleGenerator, $Injects, Config, Run } from "./../@angular";
import { NgModule } from "./../@angular";
import { ComponentsModule } from "@src/components/component.module";
import { DirectivesModule } from "@src/directives/directive.module";
import { AppService } from "@src/services/app.service";
import { AnotherService } from "@src/services/another.service";
import { InjectorModule, InjectorService } from "./../@angular/core/injector";
import { BrowserAnimationsModule } from "./../@angular/core/animations";
import { Routes, RouterModule, Router } from "./../@angular/router";

const rootRoutes: Routes = [
    { state: "settings", loadChildren: "./../settings/settings.module#SettingsModule" },
    { path: "", redirectTo: "settings", pathMatch: "full" },
    { path: "**", redirectToPath: "errors/notfound", pathMatch: "full" }
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

    @Run("@injector", "@router")
    public configInjects(injector: InjectorService, router: Router) {
        // console.log(router.RoutesTree);
    }

}
