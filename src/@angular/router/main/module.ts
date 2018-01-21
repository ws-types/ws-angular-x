import * as uuid from "uuid/v4";
import * as camelCase from "camelcase";
import {
    ModuleGenerator, NgModule, $NgModule,
    ComponentGenerator, Config
} from "./../../compilers";
import { Routes, ITreeRoute } from "./../config/config";
import {
    RouterRootDuplicatedError,
    RoutersConfigUndefinedError,
    RoutersDefaultHomeUndefinedError,
    SubRoutesNoPathError,
    OtherwiseRoutesDefineError
} from "./../../utils/errors";
import { DI } from "../../di/container";
import { Route, uirouter_stamp } from "./../config/config";
import { Router } from "../services/router.service";
import { StateProvider, UrlRouterProvider, Ng1StateDeclaration, LocationServices, StateRegistry } from "@uirouter/angularjs";
import { RouterOutletDirective } from "./../directives/router-outlet.directive";
import { IModuleConfig, IModulePayload, IComponentClass, IModuleClass } from "./../../metadata";
import { ILazyLoad } from "oclazyload";


export const uirouter = new ModuleGenerator("ui.router");
export const oclazyload = new ModuleGenerator("oc.lazyLoad");

const mdconfig: IModuleConfig = {
    imports: [uirouter, oclazyload],
    providers: [Router],
    declarations: [RouterOutletDirective]
};

@NgModule(mdconfig)
export class RouterModule {

    public static $inject = [];

    private mainRouters: Routes;
    private childRouters: Routes = [];

    private _routesConfig: ITreeRoute[];
    public get RoutesList() { return this._routesConfig; }

    constructor() {
        if (DI.GetValue(uirouter_stamp)) {
            return;
        }
        DI.Register(uirouter_stamp, this);
    }

    public static forRoot(routes?: Routes, config?: any) {
        if (!routes) {
            throw RoutersConfigUndefinedError();
        }
        const router = RouterHandler.GetRouterModule();
        if (!router.mainRouters) {
            router.mainRouters = routes;
            RouterHandler.ParseRoutesLazyload(routes);
            RouterHandler.ParseRoutesComponent(routes);
            router.childRouters = [];
        } else {
            throw RouterRootDuplicatedError();
        }
        return $NgModule(mdconfig).Decorate(RouterModule);
    }

    public static forChild(childRoute: Route): IModulePayload {
        return LazyLoadHandler.ConfLazyRouterConfig(childRoute);
    }

    @Config("$stateProvider", "$urlRouterProvider")
    public configRoutes(state: StateProvider, urlProvider: UrlRouterProvider) {
        const states: ITreeRoute[] = [];
        const router = RouterHandler.GetRouterModule();
        const mains = router.mainRouters;
        mains.forEach(subRt => RouterHandler.SetStates(subRt, state, states, urlProvider));
        RouterHandler.ConfDefaultHome(mains, state, states, urlProvider);
        RouterHandler.ConfDefaultOtherwise(mains, state, states, urlProvider);
        router._routesConfig = states;
    }

}

const default_devide = "$DEFAULT_DEVIDE_STAMP_USED_INNER$";
const impossible_url = "$IMPOSSIBLE_ROUTER_PATH$";
const default_otherwise = "__otherwise";
const default_home = "__default";
const empty_path = "";

export class RouterHandler {

    public static GetRouterModule() {
        let instance: RouterModule;
        if (!DI.GetValue(uirouter_stamp)) {
            instance = new RouterModule();
        } else {
            instance = DI.GetValue(uirouter_stamp);
        }
        return instance;
    }

    public static ConfDefaultOtherwise(mains: Route[], state: StateProvider, states: ITreeRoute[], urlProvider: UrlRouterProvider) {
        const otherwise = mains.find(i => !i.state && i.path === "**");
        if (otherwise && otherwise.redirectToPath) {
            otherwise.state = default_otherwise;
            RouterHandler.SetState(state, otherwise, states, urlProvider);
        } else {
            throw OtherwiseRoutesDefineError();
        }
    }

    public static ConfDefaultHome(mains: Route[], state: StateProvider, states: ITreeRoute[], urlProvider: UrlRouterProvider) {
        const home = mains.find(i => !i.state && i.path === "");
        if (home) {
            const redrect = mains.find(ind => ind.state === home.redirectTo);
            if (!redrect) {
                throw RoutersDefaultHomeUndefinedError();
            } else {
                home.state = default_home;
                home.path = empty_path;
                home.redirectTo = redrect.state;
            }
            RouterHandler.SetState(state, home, states, urlProvider);
        }
    }

    public static SetStates(subRt: Route, state: StateProvider | StateRegistry, savings: ITreeRoute[], urlProvider: UrlRouterProvider) {
        RouterHandler.SetState(state, subRt, savings, urlProvider);
        if (subRt.children && subRt.children.length !== 0) {
            subRt.children.forEach(smRt => RouterHandler.SetStates(smRt, state, savings, urlProvider));
        }
    }

    public static SetState(state: StateProvider | StateRegistry, subRt: Route, savings: ITreeRoute[], urlProvider: UrlRouterProvider) {
        if (!subRt.state) {
            return;
        }
        subRt.path = (!subRt.path && subRt.path !== "") ? subRt.state : subRt.path;
        const config: Ng1StateDeclaration = {
            name: subRt.state,
            url: RouterHandler.CheckIfAbsolutePath(subRt),
            redirectTo: subRt.redirectTo,
            abstract: false
        };
        if (subRt.parent) {
            config.parent = subRt.parent;
        }
        if (subRt.loadChildren) {
            config.lazyLoad = ($transition$, $state) => {
                const $ocLazyLoad: ILazyLoad = $transition$.injector().get("$ocLazyLoad");
                return ((subRt.loadChildren as any)() as Promise<IModuleClass>).then(module => {
                    const generator: ModuleGenerator = <any>module.generator;
                    generator.RunLazyLoads((lazy) => {
                        if (lazy._ngModuleLazyConfig) {
                            lazy._ngModuleLazyConfig(<any>config.parent, config.name.replace(".**", ""), generator);
                        }
                    });
                    return $ocLazyLoad.load(module.generator.Build() as any);
                });
            };
        } else {
            if (subRt.state === default_otherwise) {
                config.url = impossible_url;
                config.redirectTo = "handle => " + subRt.redirectToPath;
                config.abstract = true;
                try {
                    urlProvider.otherwise(subRt.redirectToPath);
                } catch (e) {
                    throw OtherwiseRoutesDefineError();
                }
            }
            const comp = <string>subRt.component;
            const params = subRt.params || [];
            if (comp) {
                config.component = comp;
            }
            if (params.length > 0) {
                config.params = {};
                params.forEach(name => config.params[name] = {
                    value: null,
                    dynamic: true
                });
            }
        }
        if (state instanceof StateProvider) {
            state.state(config);
        } else {
            state.register(config);
        }
        const sv: ITreeRoute = {
            state: config.name,
            url: config.url
        };
        if (config.parent) { sv.parent = config.parent; }
        if (config.component) { sv.component = config.component; }
        if (config.redirectTo) { sv.redirect = <string>config.redirectTo; }
        if (config.lazyLoad) { sv.loadChildren = config.lazyLoad; }
        savings.push(sv);
    }

    public static CheckIfAbsolutePath(subRt: Route) {
        if (subRt.path) {
            if (subRt.path.substring(0, 1) === "/") {
                return "^" + subRt.path;
            } else if (subRt.path.toString() === default_devide) {
                return "/";
            } else {
                return "/" + subRt.path;
            }
        } else {
            return empty_path;
        }
    }

    public static ParseRoutesState(route: Route, pre_states?: [string, string]) {
        let hasParent = false;
        if (pre_states) {
            [route.parent, route.state] = pre_states;
            if (route.parent) {
                hasParent = true;
            }
        } else {
            const coll = route.state.split(".");
            route.state = coll[coll.length - 1];
            if (coll.length > 1) {
                hasParent = true;
                route.parent = coll[coll.length - 2];
            }
        }
        const these = route.children.filter(child => !!child.state);
        these.forEach(child => { // build children states
            child.parent = route.state;
        });
        // set local route level's default redirect.
        RouterHandler.SetRedirect(route, these, hasParent ? route.parent : null, route.state);
    }

    public static SetRedirect(route: Route, these: Route[], prefix: string, subPre: string) {
        const df = route.children.filter(child => !child.state && child.path === "")[0];
        if (df) { // build the default redirect and otherwise
            if (df.redirectTo) {
                const found = these.find(i => i.state === df.redirectTo);
                if (found) { // redirect to this current route level
                    df.state = route.state;
                    df.path = route.path || route.state;
                    df.redirectTo = found.state;
                } else { // redirect to out routes level, ignore checks.
                    df.state = route.state;
                    df.path = route.path || route.state;
                }
                if (prefix) {
                    df.parent = prefix;
                }
                route.children.push({
                    state: uuid(),
                    path: default_devide,
                    redirectTo: df.redirectTo,
                    parent: subPre
                }); // empty routes config
            }
        }
    }

    public static ParseRoutesComponent(routes: Routes) {
        routes.filter(child => !!child.component).forEach(child => {
            if (typeof (child.component) !== "string") {
                if ((<IComponentClass>(child.component)).generator) {
                    child.component = (<IComponentClass>(child.component)).generator.Selector;
                } else {
                    child.component = (<ComponentGenerator>(child.component)).Selector;
                }
            }
        });
    }

    public static ParseRoutesLazyload(routes: Routes) {
        routes.filter(child => !!child.loadChildren).forEach(child => {
            child.path = child.path || child.state;
            child.state = `${child.state}.**`;
        });
    }
}

export class LazyLoadHandler {

    public static ConfLazyRouterConfig(childRoute: Route): IModulePayload {
        const router = RouterHandler.GetRouterModule();
        return {
            _ngPayload: {
                _ngModuleLazyConfig: (pre_state: string, state: string, generator: ModuleGenerator) => {
                    generator.LazyConfig(["$stateRegistryProvider", (provider: StateRegistry) => {
                        RouterHandler.ParseRoutesState(childRoute, [pre_state, state]);
                        RouterHandler.ParseRoutesComponent(childRoute.children);
                        RouterHandler.ParseRoutesLazyload(childRoute.children);
                        childRoute.children.forEach(subRt => {
                            const prefix = subRt.state;
                            if (!prefix) {
                                throw SubRoutesNoPathError();
                            }
                            RouterHandler.SetStates(subRt, provider, router.RoutesList, null);
                        });
                    }]);
                }
            },
            _ngConfig: [],
            _ngInvokers: [
                (module: ModuleGenerator) => {
                    console.log(module);
                }
            ]
        };
    }

}

