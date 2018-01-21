import { NgModule } from "@angular";
import { Route, RouterModule } from "@angular/router";
import { LazyFuckComponent } from "@src/lazy/subLazy/fuck.conponent";
import { LazyFuck2Component } from "@src/lazy/subLazy/fuck2.conponent";

const childRoutes: Route = {
    state: "", children: [
        { path: "fuck", component: LazyFuckComponent },
        { path: "fuck02", component: LazyFuck2Component },
        { path: "more", loadChildren: "./moreLazy/moreLazy.module#LazyMoreModule" },
        { path: "", redirectTo: "fuck" },
    ]
};

@NgModule({
    imports: [
        RouterModule.forChild(childRoutes)
    ],
    providers: [],
    declarations: [
        LazyFuckComponent,
        LazyFuck2Component
    ]
})
export class LazyOthersModule {

}
