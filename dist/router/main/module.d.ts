import { ModuleGenerator } from "@angular";
import { Routes } from "@angular/router/config/config";
import { Route } from "./../config/config";
import { StateProvider, UrlRouterProvider } from "@uirouter/angularjs";
export declare const uirouter: ModuleGenerator;
export declare class RouterModule {
    static $inject: any[];
    mainRouters: Routes;
    childRouters: Routes;
    routesConfig: any;
    constructor();
    static forRoot(routes?: Routes, config?: any): typeof RouterModule;
    static forChild(routes: Route): typeof RouterModule;
    configRoutes(state: StateProvider, urlProvider: UrlRouterProvider): void;
}
