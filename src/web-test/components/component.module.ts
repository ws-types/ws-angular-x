import { NgModule } from "@angular";
import { NewComponent } from "@src/components/comp01/new.component";
import { OutComponent } from "@src/components/comp02/outer.component";
import { RouterModule } from "@angular/router/main/module";
import { Routes, Route } from "@angular/router";
import { TestTempRefComponent } from "@src/components/comp03/testTEMPref.component";
import { TabsComponent } from "@src/components/tabs/tabs.component";

@NgModule({
    declarations: [
        NewComponent,
        OutComponent,
        TestTempRefComponent,
        TabsComponent
    ],
    providers: []
})
export class ComponentsModule {

}
