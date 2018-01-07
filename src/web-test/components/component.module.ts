import { NgModule } from "@angular";
import { NewComponent } from "@src/components/comp01/new.component";
import { OutComponent } from "@src/components/comp02/outer.component";
import { RouterModule } from "@angular/router/main/module";
import { Routes, Route } from "@angular/router";

@NgModule({
    declarations: [
        NewComponent,
        OutComponent
    ],
    providers: []
})
export class ComponentsModule {

}
