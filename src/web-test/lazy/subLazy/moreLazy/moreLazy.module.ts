import { NgModule } from "@angular";
import { Route, RouterModule } from "@angular/router";

const childRoutes: Route = {
    state: "lazy.others.more", children: [
        { state: "more01", component: null },
        { state: "more02", component: null },
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
