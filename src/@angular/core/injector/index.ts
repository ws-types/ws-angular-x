import { Injectable } from "@angular/compilers/decoretors";
import { DI } from "@angular/compilers/features/reflect";
import { NgModule, Type, $Injectable, IProviderClass } from "@angular";
import { IControllerConstructor } from "angular";
import { InjectorService } from "./services/injector.service";

export { InjectorService };

@NgModule({
    providers: [InjectorService]
})
export class InjectorModule {

}
