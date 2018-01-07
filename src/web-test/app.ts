import { ModuleGenerator, $Injects, Config, Run } from "@angular";
import { NgModule } from "@angular";
import { ComponentsModule } from "@src/components/component.module";
import { DirectivesModule } from "@src/directives/directive.module";
import { AppService } from "@src/services/app.service";
import { AnotherService } from "@src/services/another.service";
import { InjectorModule, InjectorService } from "@angular/core/injector";
import { BrowserAnimationsModule } from "@angular/core/animations";
import { Routes, RouterModule, Router } from "@angular/router";
import { FirstComponent } from "@src/root.component";

const rootRoutes: Routes = [
    { state: "lazy", loadChildren: "./lazy/lazy.module#LazyModule" },
    { state: "home", component: FirstComponent },
    { path: "", redirectTo: "home" },
    { path: "**", redirectToPath: "errors/notfound" }
];

@NgModule({
    imports: [
        InjectorModule,
        RouterModule.forRoot(rootRoutes),
        BrowserAnimationsModule,
        ComponentsModule,
        DirectivesModule
    ],
    declarations: [
        FirstComponent
    ],
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
