import * as uuid from "uuid/v4";
import * as camelCase from "camelcase";
import {
    ModuleGenerator, NgModule, $NgModule,
    ComponentGenerator, Config
} from "./../../compilers";
import { Routes, ITreeRoute } from "./../config/config";
import { DI } from "../../compilers/features/reflect";
import {
    RouterRootDuplicatedError,
    RoutersConfigUndefinedError,
    RoutersDefaultHomeUndefinedError,
    SubRoutesNoPathError,
    OtherwiseRoutesDefineError
} from "./../../utils/errors";
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
    public routesConfig: ITreeRoute[];

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
        router.routesConfig = states;
    }

}

const default_devide = "$/%$#@";
const impossible_url = "^%&^&%$";

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
            otherwise.state = "__otherwise";
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
                home.state = "__default";
                home.path = "";
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
                    return $ocLazyLoad.load(module.generator.Build() as any);
                });
            };
        } else {
            if (subRt.state === "__otherwise") {
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
                params.forEach(name => config.params[name] = "");
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
            return "";
        }
    }

    public static ParseRoutesState(route: Route) {
        const coll = route.state.split(".");
        route.state = coll[coll.length - 1];
        if (coll.length > 1) {
            route.parent = coll[coll.length - 2];
        }
        const these = route.children.filter(child => !!child.state);
        these.forEach(child => { // 构建子集的state
            child.parent = route.state;
        });
        // 设置当前级别目录的默认重定向
        RouterHandler.SetRedirect(route, these, coll.length > 1 ? route.parent : null, route.state);
    }

    public static SetRedirect(route: Route, these: Route[], prefix: string, subPre: string) {
        const df = route.children.filter(child => !child.state && child.path === "")[0];
        if (df) { // 构建默认完全重定向和默认完全失败匹配
            if (df.redirectTo) {
                const found = these.find(i => i.state === df.redirectTo);
                if (found) { // 重定向在本级路由内
                    df.state = route.state;
                    df.path = route.path || route.state;
                    df.redirectTo = found.state;
                } else { // 重定向到外部路由，不检查正确性
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
                }); // 空路径统配
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

    public static ConfLazyRouterConfig(childRoute: Route) {
        const router = RouterHandler.GetRouterModule();
        return {
            _ngConfig: [
                ["$stateRegistryProvider", (provider) => {
                    RouterHandler.ParseRoutesState(childRoute);
                    RouterHandler.ParseRoutesComponent(childRoute.children);
                    RouterHandler.ParseRoutesLazyload(childRoute.children);
                    childRoute.children.forEach(subRt => {
                        const prefix = subRt.state;
                        if (!prefix) {
                            throw SubRoutesNoPathError();
                        }
                        RouterHandler.SetStates(subRt, provider, router.routesConfig, null);
                    });
                }]
            ]
        };
    }

}

