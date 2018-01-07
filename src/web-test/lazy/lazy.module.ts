import { LazyBComponent } from "./bbb/bbb.component";
import { LazyAComponent } from "./aaa/aaa.component";
import { NgModule } from "@angular";
import { Route, RouterModule } from "@angular/router";

const childRoutes: Route = {
    state: "lazy", children: [
        { state: "index", component: LazyAComponent },
        { state: "details", path: "details/:detailsId?{homeId}&{seed}", params: ["detailsId", "homeId", "seed"], component: LazyBComponent },
        { state: "others", loadChildren: "./subLazy/sub.module#LazyOthersModule" },
        { path: "", redirectTo: "index" },
    ]
};

@NgModule({
    imports: [
        RouterModule.forChild(childRoutes)
    ],
    providers: [],
    declarations: [
        LazyAComponent,
        LazyBComponent
    ]
})
export class LazyModule {

}
