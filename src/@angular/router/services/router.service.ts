import { Injectable } from "../../compilers/decoretors/provider";
import { Subject } from "rxjs/Subject";
import { Transition, StateService, StateDeclaration, RawParams } from "@uirouter/angularjs";
import { uirouter_stamp } from "./../config/config";
import { DI } from "./../../compilers/features/reflect";
import { RouterModule } from "../main/module";
import { Routes } from "./../config/config";

export interface IRouteBundle {
    from?: StateDeclaration;
    to?: StateDeclaration;
    params?: RawParams;
    url?: string;
}

@Injectable("@router")
export class Router {

    public static $inject = ["$state", "$transitions", "$location"];

    public get RoutesTree(): Routes {
        const rtmd: RouterModule = DI.GetValue(uirouter_stamp);
        return !rtmd ? null : rtmd.routesConfig;
    }

    private _stateChanges = new Subject<IRouteBundle>();
    public get stateChanges() { return this._stateChanges; }

    private _errorsOcc = new Subject<string>();
    public get errors() { return this._errorsOcc; }

    constructor(private state: StateService, private transitions: Transition, private $location: ng.ILocationService) {
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

    public navigate(url: string[] | string, params?: RawParams) {
        if (url instanceof Array) {
            this.$location.path(url.join("/")).search(params);
        } else {
            this.$location.path(url).search(params);
        }
    }

}
