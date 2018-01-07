import "reflect-metadata";
import * as angular from "angular";
import { Injectable } from "./../decoretors";

export class ReflectContainer {

    public get Providers() { return this._providers; }

    private _providers: { [key: string]: any; };

    constructor() {
        this._providers = {};
    }

    public Register(key: string, value: any) {
        this._providers[key] = value;
    }

    public GetKey(value: any): string {
        const tuples = Object.keys(this._providers).map(key => [key, this._providers[key]] as [string, any]);
        return (tuples.find(([k, v]) => value === v) || [null, value])[0];
    }

    public GetValue(key: string): any {
        return this._providers[key] || null;
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

class ClassMetadataParser {

    static COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    static DEFAULT_PARAMS = /=[^,]+/mg;
    static FAT_ARROWS = /=>.*$/mg;
    static CLASS_HEAD = /class.+{/;
    static CTOR_HEAD = /constructor.+{/;

    static GetES5CtorParamsName(fn): string[] {
        const code = fn.toString()
            .replace(ClassMetadataParser.COMMENTS, "")
            .replace(ClassMetadataParser.FAT_ARROWS, "")
            .replace(ClassMetadataParser.DEFAULT_PARAMS, "");

        const result = code.slice(code.indexOf("(") + 1, code.indexOf(")"))
            .match(/([^\s,]+)/g);

        return result === null ? [] : result;
    }

    static GetES6CtorParamsName(c) {
        const code = c.toString();
        if (!ClassMetadataParser.CLASS_HEAD.test(code) || !ClassMetadataParser.CTOR_HEAD.test(code)) {
            return null;
        }
        code.replace(ClassMetadataParser.COMMENTS, "")
            .replace(ClassMetadataParser.FAT_ARROWS, "")
            .replace(ClassMetadataParser.DEFAULT_PARAMS, "")
            .replace(ClassMetadataParser.CLASS_HEAD, "");
        const result = code.slice(code.indexOf("(") + 1, code.indexOf(")"))
            .match(/([^\s,]+)/g);
        return result === null ? null : result;
    }

}
