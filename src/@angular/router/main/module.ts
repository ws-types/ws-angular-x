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
import { IModuleConfig, IModulePayload } from "./../../metadata";
import { RouterModuleHandler } from "./../utils/handler";
import { LazyLoadHandler } from "./../utils/lazyload";


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

        const router = RouterModuleHandler.GetRouterModule();
        if (!router.mainRouters) {
            router.mainRouters = routes;
            // 为第一级懒加载路由挂载钩子
            RouterModuleHandler.ParseRoutesLazyload(routes);
            // 为第一级路由条目解析组件
            RouterModuleHandler.ParseRoutesComponent(routes);
            router.childRouters = [];
        } else { // 没有主路由集合，非常的错误
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
        const router = RouterModuleHandler.GetRouterModule();
        const mains = router.mainRouters;
        mains.forEach(subRt => RouterModuleHandler.SetStates(subRt, state, states, urlProvider));

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
            RouterModuleHandler.SetState(state, home, states, urlProvider);
        }

        // default otherwise url
        const otherwise = mains.find(i => !i.state && i.path === "**");
        if (otherwise && otherwise.redirectToPath) {
            otherwise.state = "__otherwise";
            RouterModuleHandler.SetState(state, otherwise, states, urlProvider);
        } else {
            throw OtherwiseRoutesDefineError();
        }

        router.routesConfig = states;
    }

}



