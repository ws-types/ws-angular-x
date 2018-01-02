import { Subject } from "rxjs/Subject";
import { Transition, StateService, StateDeclaration, RawParams } from "@uirouter/angularjs";
import { Routes } from "./../config/config";
export declare class Router {
    private state;
    private transitions;
    static $inject: string[];
    readonly RoutesTree: Routes;
    private _params;
    readonly params: Subject<any>;
    private _stateChanges;
    readonly stateChanges: Subject<StateDeclaration>;
    private _errorsOcc;
    readonly errors: Subject<StateDeclaration>;
    constructor(state: StateService, transitions: Transition);
    private initHooks();
    GoTo(state: string, params?: RawParams): void;
}
