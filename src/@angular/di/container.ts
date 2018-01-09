import { ClassMetadataParser } from "./class-metadata-parser";
import { InjectionKeyDepulicateError } from "./../utils/errors";


export class ReflectContainer {

    public get Providers() { return this.__providers; }

    // private _providers: { [key: string]: any; };
    private __providers: [string, any][];

    constructor() {
        // this._providers = {};
        this.__providers = [];
    }

    public Register(key: string, value: any) {
        // this._providers[key] = value;
        if (this.__providers.findIndex(([k, v]) => k === key) < 0) {
            this.__providers.push([key, value]);
        } else {
            throw InjectionKeyDepulicateError(key);
        }
    }

    public GetKey(value: any): string {
        return (this.__providers.find(([k, v]) => value === v) || [null, value])[0];
    }

    public GetValue(key: string): any {
        const ele = this.__providers.find(([k, v]) => k === key);
        return !ele ? null : (ele[1] || null);
    }

    public GetArguments(func: any): string[] {
        return ClassMetadataParser.GetES5CtorParamsName(func);
    }

}

export const DI = new ReflectContainer();

export function Inject(func: any): string {
    return DI.GetKey(func);
}

export function Injects(func_names: any[]): string[] {
    return func_names.map(fn => typeof (fn) === "string" ? fn : DI.GetKey(fn));
}
