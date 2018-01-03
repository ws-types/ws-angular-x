import { Injectable, NgModule } from "./../../compilers/decoretors";
import { DI } from "./../../compilers/features/reflect";
import { Type, IProviderClass } from "./../../metadata";
import { IControllerConstructor } from "angular";
import { InjectorService } from "./services/injector.service";

export { InjectorService };

@NgModule({
    providers: [InjectorService]
})
export class InjectorModule {

}
