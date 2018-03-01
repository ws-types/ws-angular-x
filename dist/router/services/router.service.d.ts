/// <reference types="angular" />
import { Subject } from "rxjs/Subject";
import { Transition, StateService, StateDeclaration, RawParams } from "@uirouter/angularjs";
import { ITreeRoute } from "./../../router";
export interface IRouteBundle {
    from?: StateDeclaration;
    to?: StateDeclaration;
    params?: RawParams;
    url?: string;
}
export declare class Router {
    private state;
    private transitions;
    private $location;
    static $inject: string[];
    private routerModule;
    readonly RoutesTree: ITreeRoute[];
    readonly RoutesConfig: string;
    private _stateChanges;
    readonly stateChanges: Subject<IRouteBundle>;
    private _errorsOcc;
    readonly errors: Subject<string>;
    constructor(state: StateService, transitions: Transition, $location: ng.ILocationService);
    private initHooks();
    GoTo(state: string, params?: RawParams): void;
    navigate(url: string[] | string, params?: RawParams, replace?: boolean): void;
}
