import { DI } from "../../../di/container";
import { Injectable } from "./../../../compilers";
import { Type } from "./../../../metadata";


@Injectable("@injector")
export class InjectorService {

    public static $inject = ["$injector"];

    constructor(private injector: ng.auto.IInjectorService) { }

    public Get<T>(v: Type<T> | string) {
        let key: string;
        if (typeof (v) !== "string") {
            key = DI.GetKey(v);
        } else {
            key = v;
        }
        return this.injector.has(key) ? this.injector.get(key) as T : null;
    }

}
