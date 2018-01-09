import { Injectable, NgModule } from "./../../compilers/decoretors";
import { Type, IProviderClass } from "./../../metadata";
import { IControllerConstructor } from "angular";
import { InjectorService } from "./services/injector.service";

export { InjectorService };

@NgModule({
    providers: [InjectorService]
})
export class InjectorModule {

}
