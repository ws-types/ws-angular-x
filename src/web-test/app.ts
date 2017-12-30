import { Module } from "@angular/fluent";
import { ModuleGenerator } from "@angular";
import { NgModule } from "@angular";
import { NewComponent } from "@src/components/new.component";

// export const AppModule = Module({
//     selector: "app-module",
//     imports: [],
//     declarations: [],
//     providers: []
// });

@NgModule({
    selector: "app-module",
    imports: [],
    declarations: [NewComponent],
    providers: []
})
export class AppModule {

}
