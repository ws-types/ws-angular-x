import { NgModule } from "@angular";
import { NewComponent } from "@src/components/comp01/new.component";
import { OutComponent } from "@src/components/comp02/outer.component";
import { RouterModule } from "@angular/router/main/module";
import { Routes, Route } from "@angular/router";

const childRoutes: Route = {
    state: "settings", children: [
        { state: "index", path: "index", component: OutComponent },
        { state: "details", path: ":statusid/details", component: OutComponent },
        { path: "", redirectTo: "index", pathMatch: "full" },
        { path: "**", redirectTo: "errors.404", pathMatch: "full" }
    ]
};

@NgModule({
    imports: [
        RouterModule.forChild(childRoutes),
    ],
    declarations: [
        NewComponent,
        OutComponent
    ],
    providers: []
})
export class ComponentsModule {

    constructor() {
        console.log("comp module created");
    }

}
