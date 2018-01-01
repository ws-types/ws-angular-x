import { Injectable } from "../../compilers/decoretors/provider";
import { Subject } from "rxjs/Subject";
import { Transition, StateService, StateDeclaration, RawParams } from "@uirouter/angularjs";
import { uirouter_stamp } from "./../main/module";
import { DI } from "@angular/compilers/features/reflect";
import { RouterModule } from "../main/module";
import { Routes } from "./../config/config";

@Injectable("@router")
export class Router {

    public static $inject = ["$state", "$transitions"];

    public get RoutesTree(): Routes {
        const rtmd: RouterModule = DI.GetValue(uirouter_stamp);
        return !rtmd ? null : rtmd.routesConfig;
    }

    private _params = new Subject<any>();
    public get params() { return this._params; }

    private _stateChanges = new Subject<StateDeclaration>();
    public get stateChanges() { return this._stateChanges; }

    private _errorsOcc = new Subject<StateDeclaration>();
    public get errors() { return this._errorsOcc; }

    constructor(private state: StateService, private transitions: Transition) {
        this.initHooks();
    }

    private initHooks() {
        this.transitions.onSuccess({}, transitions => {
            this._stateChanges.next(transitions.to());
            this._params.next(transitions.params("to"));
        });
        this.transitions.onError({}, transtions => {
            this._errorsOcc.next(transtions.error());
        });
    }

    public GoTo(state: string, params?: RawParams) {
        this.state.go(state, params);
    }

}
