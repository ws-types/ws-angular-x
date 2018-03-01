import { ModuleGenerator } from "./../../compilers";
import { Routes, ITreeRoute } from "./../config/config";
import { Route } from "./../config/config";
import { StateProvider, UrlRouterProvider, StateRegistry } from "@uirouter/angularjs";
import { IModulePayload } from "./../../metadata";
export declare const uirouter: ModuleGenerator;
export declare const oclazyload: ModuleGenerator;
export declare class RouterModule {
    static $inject: any[];
    private mainRouters;
    private childRouters;
    private _routesConfig;
    readonly RoutesList: ITreeRoute[];
    constructor();
    static forRoot(routes?: Routes, config?: any): typeof RouterModule;
    static forChild(childRoute: Route): IModulePayload;
    configRoutes(state: StateProvider, urlProvider: UrlRouterProvider): void;
}
export declare class RouterHandler {
    static GetRouterModule(): RouterModule;
    static ConfDefaultOtherwise(mains: Route[], state: StateProvider, states: ITreeRoute[], urlProvider: UrlRouterProvider): void;
    static ConfDefaultHome(mains: Route[], state: StateProvider, states: ITreeRoute[], urlProvider: UrlRouterProvider): void;
    static BuildStateUnique(subRt: Route): void;
    static SetStates(subRt: Route, state: StateProvider | StateRegistry, savings: ITreeRoute[], urlProvider: UrlRouterProvider): void;
    static SetState(state: StateProvider | StateRegistry, subRt: Route, savings: ITreeRoute[], urlProvider: UrlRouterProvider): void;
    static CheckIfAbsolutePath(subRt: Route): string;
    static ParseRoutesState(route: Route, pre_states?: [string, [string, string]]): void;
    static SetRedirect(route: Route, these: Route[], prefix: string, subPre: string): void;
    static ParseRoutesComponent(routes: Routes): void;
    static ParseRoutesLazyload(routes: Routes): void;
}
export declare class LazyLoadHandler {
    static ConfLazyRouterConfig(childRoute: Route): IModulePayload;
}
