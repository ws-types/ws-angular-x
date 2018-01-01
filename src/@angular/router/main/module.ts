import * as uuid from "uuid/v4";
import {
    ModuleGenerator, NgModule, $NgModule,
    ComponentGenerator, IComponentClass,
    Config, IModuleConfig
} from "@angular";
import { Routes } from "@angular/router/config/config";
import { DI } from "../../compilers/features/reflect";
import { RouterRootDuplicatedError } from "@angular/utils/errors";
import { Route } from "@angular/router";
import { Router } from "@angular/router/services/router.service";
import { StateProvider, UrlRouterProvider, Ng1StateDeclaration } from "@uirouter/angularjs";
import { RouterOutletDirective } from "@angular/router/directives/router-outlet.directive";

export const uirouter_stamp = "reflect:ng-module-router-angular-x-v1";
export const uirouter = new ModuleGenerator("ui.router");

const mdconfig: IModuleConfig = {
    imports: [uirouter],
    providers: [Router],
    declarations: [RouterOutletDirective]
};

@NgModule(mdconfig)
export class RouterModule {

    public static $inject = [];

    public mainRouters: Routes;
    public childRouters: Routes = [];
    public routesConfig: any;

    constructor() {
        // console.log(DI.Providers);
        // console.log(DI.GetValue(uirouter_stamp));
        if (DI.GetValue(uirouter_stamp)) {
            return;
        }
        DI.Register(uirouter_stamp, this);
    }

    public static forRoot(routes: Routes, config?: any) {
        const router = getRouterModule();
        if (!router.mainRouters) {
            router.mainRouters = routes;

            router.childRouters.forEach(route => {
                const prefix = route.state;
                if (prefix) {
                    parseRoutesState(route, prefix);
                    parseRoutesComponent(route);
                    parseRoutesParent(router, route);
                }
            });

            router.childRouters = [];

        } else {
            throw RouterRootDuplicatedError();
        }
        return $NgModule(mdconfig).Decorate(RouterModule);
    }

    public static forChild(routes: Route) {
        const router = getRouterModule();
        router.childRouters.push(routes);
        return $NgModule(mdconfig).Decorate(RouterModule);
    }

    @Config("$stateProvider", "$urlRouterProvider")
    public configRoutes(state: StateProvider, urlProvider: UrlRouterProvider) {
        // console.log("conf routers #########");

        const states = [];
        const router = getRouterModule();
        const mains = router.mainRouters;
        const home = mains.find(i => !i.state && i.path === "");
        if (home) {
            const redrect = mains.find(ind => ind.state === home.redirectTo);
            urlProvider.otherwise(!redrect ? "/" : redrect.path);
        }
        mains.forEach(subRt => setStates(subRt, state, states));
        router.routesConfig = states;
        // console.log(router);

        // console.log("######################");
    }

}

function setStates(subRt: Route, state: StateProvider, savings: any[]) {
    if (!subRt.children || subRt.children.length === 0) {
        setState(state, subRt, savings);
    } else {
        subRt.children.forEach(smRt => setStates(smRt, state, savings));
    }
}

function setState(state: StateProvider, subRt: Route, savings: any[]) {
    if (subRt.state) {
        const comp = <string>subRt.component;
        const params = subRt.params || [];
        const config: Ng1StateDeclaration = {
            name: subRt.state,
            url: subRt.path ? "/" + subRt.path : "",
            redirectTo: subRt.redirectTo
        };
        if (comp) {
            config.component = comp;
        } else {
            config.abstract = true;
        }
        if (params.length > 0) {
            config.params = {};
            params.forEach(name => config.params[name] = "");
        }
        state.state(config);
        savings.push(config);
    }
}

function parseRoutesParent(router: RouterModule, route: Route) {
    const root = router.mainRouters.find(i => i.state === route.state);
    if (root) {
        root.children = route.children;
    }
}

function parseRoutesState(route: Route, prefix: string) {
    route.children.filter(child => !!child.state || child.path === "").forEach(child => {
        if (child.path === "") {
            child.state = prefix; // for redirect .
        } else {
            child.state = `${prefix}.${child.state}`;
        }
    });
}

function parseRoutesComponent(route: Route) {
    route.children.filter(child => !!child.component).forEach(child => {
        if (typeof (child.component) !== "string") {
            if ((<IComponentClass>(child.component)).generator) {
                child.component = (<IComponentClass>(child.component)).generator.Selector;
            } else {
                child.component = (<ComponentGenerator>(child.component)).Selector;
            }
        }
    });
}

function getRouterModule() {
    let instance: RouterModule;
    if (!DI.GetValue(uirouter_stamp)) {
        instance = new RouterModule();
    } else {
        instance = DI.GetValue(uirouter_stamp);
    }
    return instance;
}

