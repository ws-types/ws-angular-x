import { DI } from "../../di/container";
import { Injectable } from "../../compilers/decoretors/provider";
import { Subject } from "rxjs/Subject";
import { Transition, StateService, StateDeclaration, RawParams } from "@uirouter/angularjs";
import { uirouter_stamp } from "./../config/config";
import { RouterModule } from "../main/module";
import { Routes } from "./../config/config";
import { ITreeRoute } from "./../../router";

export interface IRouteBundle {
    from?: StateDeclaration;
    to?: StateDeclaration;
    params?: RawParams;
    url?: string;
}

@Injectable("@router")
export class Router {

    public static $inject = ["$state", "$transitions", "$location"];

    private routerModule: RouterModule;

    public get RoutesTree(): ITreeRoute[] { return this.routerModule.RoutesList; }
    public get RoutesConfig(): string {
        const final = [];
        const parser = (target: ITreeRoute[], tree: ITreeRoute[]) => {
            tree.forEach(t => {
                const newt: any = { path: t.url };
                if (t.component) {
                    newt.component = t.component;
                }
                if (t.state.includes(".**")) {
                    newt.lazyLoaded = !t.children ? false : true;
                }
                if (t.redirect) {
                    const tgt = tree.find(i => i.state === t.redirect);
                    newt.redirect = (tgt && tgt.url) || t.redirect;
                }
                if (t.children) {
                    newt.children = [];
                    parser(newt.children, t.children);
                }
                target.push(newt);
            });
        };
        parser(final, this.routerModule.RoutesList);
        return JSON.stringify(final, null, "\t");
    }

    private _stateChanges = new Subject<IRouteBundle>();
    public get stateChanges() { return this._stateChanges; }

    private _errorsOcc = new Subject<string>();
    public get errors() { return this._errorsOcc; }

    constructor(private state: StateService, private transitions: Transition, private $location: ng.ILocationService) {
        this.routerModule = DI.GetValue(uirouter_stamp);
        this.initHooks();
    }

    private initHooks() {
        this.transitions.onSuccess({}, transitions => {
            this._stateChanges.next({
                from: transitions.from(),
                to: transitions.to(),
                params: transitions.params("to"),
                url: this.$location.path()
            });
        });
        this.transitions.onError({}, transtions => {
            const error = transtions.error();
            if (typeof (error) === "string") {
                this._errorsOcc.next(error);
            }
        });
    }

    public GoTo(state: string, params?: RawParams) {
        this.state.go(state, params);
    }

    public navigate(url: string[] | string, params: RawParams = {}, replace = false) {
        let action: ng.ILocationService;
        if (url instanceof Array) {
            url[0] = url[0].startsWith("/") ? url[0] : "/" + url[0];
            action = this.$location.path(url.join("/")).search(params || {});
        } else {
            action = this.$location.path(url.startsWith("/") ? url : "/" + url).search(params || {});
        }
        if (replace === true) {
            action.replace();
        }
    }

}
