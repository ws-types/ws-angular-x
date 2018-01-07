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
import { IModuleConfig, IComponentClass, IModuleClass, IModulePayload } from "./../../metadata";
import { ILazyLoad } from "oclazyload";

export const uirouter = new ModuleGenerator("ui.router");
export const oclazyload = new ModuleGenerator("oc.lazyLoad");

const mdconfig: IModuleConfig = {
    imports: [uirouter, oclazyload],
    providers: [Router],
    declarations: [RouterOutletDirective]
};

const default_devide = "$/%$#@";
const impossible_url = "^%&^&%$";

@NgModule(mdconfig)
export class RouterModule {

    public static $inject = [];

    public mainRouters: Routes;
    public childRouters: Routes = [];
    public routesConfig: ITreeRoute[];

    constructor() {
        if (DI.GetValue(uirouter_stamp)) {
            return;
        }
        DI.Register(uirouter_stamp, this);
    }

    public static forRoot(routes?: Routes, config?: any) {

        if (!routes) { // 没有传入主路由配置，错误操作
            throw RoutersConfigUndefinedError();
        }

        const router = getRouterModule();
        if (!router.mainRouters) {
            router.mainRouters = routes;
            // 为第一级懒加载路由挂载钩子
            parseRoutesLazyload(routes);
            // 为第一级路由条目解析组件
            parseRoutesComponent(routes);
            router.childRouters = [];
        } else { // 没有主路由集合，非常的错误
            throw RouterRootDuplicatedError();
        }
        return $NgModule(mdconfig).Decorate(RouterModule);
    }

    public static forChild(childRoute: Route): IModulePayload {
        const router = getRouterModule();
        return {
            _ngConfig: [
                ["$stateRegistryProvider", (provider) => {
                    // console.log(childRoute);
                    parseRoutesState(childRoute);
                    parseRoutesComponent(childRoute.children);
                    parseRoutesLazyload(childRoute.children);
                    childRoute.children.forEach(subRt => {
                        const prefix = subRt.state;
                        if (!prefix) { // 二级路由没有开头路径，没有意义，报错
                            throw SubRoutesNoPathError();
                        }
                        setStates(subRt, provider, router.routesConfig, null);
                    });
                    // console.log(router.routesConfig);
                }]
            ]
        };
    }

    @Config("$stateProvider", "$urlRouterProvider")
    public configRoutes(state: StateProvider, urlProvider: UrlRouterProvider) {
        const states: ITreeRoute[] = [];
        const router = getRouterModule();
        const mains = router.mainRouters;
        mains.forEach(subRt => setStates(subRt, state, states, urlProvider));

        // default home url
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
            setState(state, home, states, urlProvider);
        }

        // default otherwise url
        const otherwise = mains.find(i => !i.state && i.path === "**");
        if (otherwise && otherwise.redirectToPath) {
            otherwise.state = "__otherwise";
            setState(state, otherwise, states, urlProvider);
        } else {
            throw OtherwiseRoutesDefineError();
        }

        router.routesConfig = states;
    }

}

function setStates(subRt: Route, state: StateProvider | StateRegistry, savings: ITreeRoute[], urlProvider: UrlRouterProvider) {
    setState(state, subRt, savings, urlProvider);
    if (subRt.children && subRt.children.length !== 0) {
        subRt.children.forEach(smRt => setStates(smRt, state, savings, urlProvider));
    }
}

function setState(state: StateProvider | StateRegistry, subRt: Route, savings: ITreeRoute[], urlProvider: UrlRouterProvider) {
    if (!subRt.state) {
        return;
    }
    subRt.path = (!subRt.path && subRt.path !== "") ? subRt.state : subRt.path;
    const config: Ng1StateDeclaration = {
        name: subRt.state,
        url: checkIfAbsolutePath(subRt),
        redirectTo: subRt.redirectTo,
        abstract: false
    };
    // console.log(subRt);
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

function checkIfAbsolutePath(subRt: Route) {
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

function parseRoutesState(route: Route) {
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
    setRedirect(route, these, coll.length > 1 ? route.parent : null, route.state);
}

/**
 * 设置路由重定向
 *
 * @param {Route} route
 * @param {Route[]} these
 * @param {string} prefix
 * @param {string} filter
 */
function setRedirect(route: Route, these: Route[], prefix: string, subPre: string) {
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

function parseRoutesComponent(routes: Routes) {
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

function parseRoutesLazyload(routes: Routes) {
    routes.filter(child => !!child.loadChildren).forEach(child => {
        child.path = child.path || child.state;
        child.state = `${child.state}.**`;
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

