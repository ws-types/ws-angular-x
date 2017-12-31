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
        return getParameterNames(func);
    }

}

export const DI = new ReflectContainer();

export function Inject(func: ng.IController): string {
    return DI.GetKey(func);
}

export function Injects(func_names: (ng.IController | string)[]): string[] {
    return func_names.map(fn => typeof (fn) === "string" ? fn : DI.GetKey(fn));
}

const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const DEFAULT_PARAMS = /=[^,]+/mg;
const FAT_ARROWS = /=>.*$/mg;

function getParameterNames(fn): string[] {
    const code = fn.toString()
        .replace(COMMENTS, "")
        .replace(FAT_ARROWS, "")
        .replace(DEFAULT_PARAMS, "");

    const result = code.slice(code.indexOf("(") + 1, code.indexOf(")"))
        .match(/([^\s,]+)/g);

    return result === null ? [] : result;
}