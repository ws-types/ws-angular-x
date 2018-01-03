import { Injectable, Type } from "@angular";
import { DI } from "./../../../compilers/features/reflect";


@Injectable("@injector")
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