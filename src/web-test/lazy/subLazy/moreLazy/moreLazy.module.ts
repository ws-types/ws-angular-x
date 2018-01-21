import { NgModule } from "@angular";
import { Route, RouterModule } from "@angular/router";

const childRoutes: Route = {
    state: "", children: [
        { path: "more01", component: null },
        { path: "more02", component: null },
        { path: "", redirectTo: "more01" },
    ]
};

@NgModule({
    imports: [
        RouterModule.forChild(childRoutes)
    ],
    providers: [],
    declarations: [

    ]
})
export class LazyMoreModule {

}
