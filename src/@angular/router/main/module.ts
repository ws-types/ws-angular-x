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
import { StateProvider, UrlRouterProvider, Ng1StateDeclaration, LocationServices } from "@uirouter/angularjs";
import { RouterOutletDirective } from "./../directives/router-outlet.directive";
import { IModuleConfig, IComponentClass } from "./../../metadata";

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
    public routesConfig: ITreeRoute[];

    constructor() {
        // console.log(DI.Providers);
        // console.log(DI.GetValue(uirouter_stamp));
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
            // 为第一级级路由条目解析组件
            parseRoutesComponent(routes);
            // 为二级路由寻找顶级路由，并挂钩到children
            hookChildrenRoutes(router);
            // 清空二级路由，因为已经完成挂钩
            router.childRouters = [];
        } else { // 没有主路由集合，非常的错误
            throw RouterRootDuplicatedError();
        }
        return $NgModule(mdconfig).Decorate(RouterModule);
    }

    public static forChild(routes: Route) {
        const router = getRouterModule();
        // 添加二级路由或低级路由组
        router.childRouters.push(routes);
        return $NgModule(mdconfig).Decorate(RouterModule);
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
            const redrect = states.find(ind => ind.state === home.redirectTo);
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

function hookChildrenRoutes(router: RouterModule) {
    router.childRouters.forEach(route => {
        const prefix = route.state;
        const path = route.path;
        if (!path || !prefix) { // 二级路由没有开头路径，没有意义，报错
            throw SubRoutesNoPathError();
        }
        parseRoutesState(route, prefix);
        parseRoutesComponent(route.children);
        parseRoutesParent(router, route);
    });
}

function setStates(subRt: Route, state: StateProvider, savings: ITreeRoute[], urlProvider: UrlRouterProvider) {
    setState(state, subRt, savings, urlProvider);
    if (subRt.children && subRt.children.length !== 0) {
        subRt.children.forEach(smRt => setStates(smRt, state, savings, urlProvider));
    }
}

function setState(state: StateProvider, subRt: Route, savings: ITreeRoute[], urlProvider: UrlRouterProvider) {
    if (subRt.state) {
        let path: string = checkIfAbsolutePath(subRt);
        let redirect = subRt.redirectTo;
        let abst = false;
        if (subRt.state === "__otherwise") {
            path = "";
            redirect = "handle => " + subRt.redirectToPath;
            abst = true;
            try {
                urlProvider.otherwise(subRt.redirectToPath);
            } catch (e) {
                throw OtherwiseRoutesDefineError();
            }
        }
        const comp = <string>subRt.component;
        const params = subRt.params || [];
        const config: Ng1StateDeclaration = {
            name: subRt.state,
            url: path,
            redirectTo: redirect,
            abstract: abst
        };
        if (comp) {
            config.component = comp;
        }
        if (params.length > 0) {
            config.params = {};
            params.forEach(name => config.params[name] = "");
        }
        state.state(config);
        const sv: ITreeRoute = {
            state: config.name,
            url: config.url
        };
        if (config.component) { sv.component = config.component; }
        if (config.redirectTo) { sv.redirect = <string>config.redirectTo; }
        savings.push(sv);
    }
}

function checkIfAbsolutePath(subRt: Route) {
    if (subRt.path) {
        if (subRt.path.substring(0, 1) === "/") {
            return "^" + subRt.path;
        } else {
            return "/" + subRt.path;
        }
    } else {
        return "";
    }
}

function parseRoutesParent(router: RouterModule, route: Route) {
    const root = router.mainRouters.find(i => i.state === route.state);
    if (root) { // 设置跟路由的默认配置和重定向
        root.children = route.children;
        root.path = route.path;
        root.redirectTo = `${root.state}.__default`;
    }
}

function parseRoutesState(route: Route, prefix: string) {
    const these = route.children.filter(child => !!child.state);
    these.forEach(child => { // 构建子集的state
        child.state = `${prefix}.${child.state}`;
    });
    // 设置当前级别目录的默认重定向
    setRedirect(route, these, prefix, "");
    // 设置当前目录的默认404   不匹配
    // setRedirect(route, these, prefix, "**");
}

/**
 * 设置路由重定向
 *
 * @param {Route} route
 * @param {Route[]} these
 * @param {string} prefix
 * @param {string} filter
 */
function setRedirect(route: Route, these: Route[], prefix: string, filter: string) {
    const df = route.children.filter(child => !child.state && child.path === filter)[0];
    if (df) { // 构建默认完全重定向和默认完全失败匹配
        if (df.redirectTo) {
            const found = these.find(i => i.state === `${prefix}.${df.redirectTo}`);
            if (found) { // 重定向在本级路由内
                df.state = `${prefix}.${filter || "__default"}`;
                df.path = filter;
                df.redirectTo = found.state;
            } else { // 重定向到外部路由，不检查正确性
                df.state = `${prefix}.${filter || "__default"}`;
                df.path = filter;
            }
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

function getRouterModule() {
    let instance: RouterModule;
    if (!DI.GetValue(uirouter_stamp)) {
        instance = new RouterModule();
    } else {
        instance = DI.GetValue(uirouter_stamp);
    }
    return instance;
}

