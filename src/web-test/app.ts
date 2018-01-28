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
import { FormatPipe } from "@src/pipes/format/fmt.pipe";
import { CommonModule } from "@angular/common";

const rootRoutes: Routes = [
    { path: "lazy", loadChildren: "./lazy/lazy.module#LazyModule" },
    { path: "home", component: FirstComponent },
    { path: "", redirectTo: "home" },
    { path: "**", redirectToPath: "errors/notfound" }
];

@NgModule({
    imports: [
        InjectorModule,
        CommonModule,
        RouterModule.forRoot(rootRoutes),
        BrowserAnimationsModule,
        ComponentsModule,
        DirectivesModule
    ],
    declarations: [
        FirstComponent,
        FormatPipe
    ],
    providers: [
        AppService,
        AnotherService
    ]
})
export class AppModule {

    @Run("@injector", "@router")
    public configInjects(injector: InjectorService, router: Router) {
        console.log(router.RoutesTree);
        console.log(router.RoutesConfig);
    }

}
