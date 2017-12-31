import { Injectable } from "@angular/compilers/decoretors";
import { DI } from "@angular/compilers/features/reflect";
import { NgModule, Type } from "@angular";
import { IControllerConstructor } from "angular";

@Injectable()
export class InjectorService {

    public static $inject = ["$injector"];

    constructor(private injector: ng.auto.IInjectorService) { }

    public Get<T>(v: Type<T> | string) {
        if (typeof (v) !== "string") {
            v = DI.GetKey(v);
        }
        return this.injector.has(v) ? this.injector.get(v) as T : null;
    }

}

@NgModule({
    providers: [InjectorService]
})
export class InjectorModule {

}
