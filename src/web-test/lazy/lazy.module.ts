import { LazyBComponent } from "./bbb/bbb.component";
import { LazyAComponent } from "./aaa/aaa.component";
import { NgModule } from "@angular";
import { Route, RouterModule } from "@angular/router";

const childRoutes: Route = {
    state: "", children: [
        // { path: "index", component: LazyAComponent },
        { path: "details/:detailsId?{homeId}&{seed}", params: ["detailsId", "homeId", "seed"], component: LazyBComponent },
        { path: "others", loadChildren: "./subLazy/sub.module#LazyOthersModule" },
        // { path: "", redirectTo: "index" },
        { path: "", component: LazyAComponent }
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
