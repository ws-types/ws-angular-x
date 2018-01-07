import { NgModule } from "@angular";
import { Route, RouterModule } from "@angular/router";
import { LazyFuckComponent } from "@src/lazy/subLazy/fuck.conponent";
import { LazyFuck2Component } from "@src/lazy/subLazy/fuck2.conponent";

const childRoutes: Route = {
    state: "lazy.others", children: [
        { state: "fuck", component: LazyFuckComponent },
        { state: "fuck2", component: LazyFuck2Component },
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
