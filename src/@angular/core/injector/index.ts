import { Injectable } from "@angular/compilers/decoretors";
import { DI } from "@angular/compilers/features/reflect";


@Injectable()
export class InjectorService {

    public static $inject = ["$injector"];

    constructor(private injector: ng.auto.IInjectorService) { }

    public Get<T>(v: string | T) {
        if (typeof (v) !== "string") {
            v = DI.GetKey(v);
            console.log(v);
        }
        // return this.injector.get(v) as T;
        return this.injector.has(v) ? this.injector.get(v) as T : null;
    }

}
