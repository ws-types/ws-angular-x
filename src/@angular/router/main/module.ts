import * as uuid from "uuid/v4";
import { ModuleGenerator, NgModule, $NgModule, ComponentGenerator, IComponentClass } from "@angular";
import { Routes } from "@angular/router/main/config";
import { DI } from "../../compilers/features/reflect";
import { RouterRootDuplicatedError } from "@angular/utils/errors";
import { Route } from "@angular/router";

const uirouter_stamp = "reflect:ng-module-router-angular-x-v1";
const uirouter = new ModuleGenerator("ui.router");

const mdconfig = {
    imports: [uirouter]
};

@NgModule(mdconfig)
export class RouterModule {

    public static $inject = [];

    public mainRouters: Routes;
    public childRouters: Routes = [];

    constructor() {
        console.log(DI.GetValue(uirouter_stamp));
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
        return $NgModule(mdconfig).Class(RouterModule);
    }

    public static forChild(routes: Route) {
        const router = getRouterModule();
        router.childRouters.push(routes);
        return $NgModule(mdconfig).Class(RouterModule);
    }

}

function parseRoutesParent(router: RouterModule, route: Route) {
    const root = router.mainRouters.find(i => i.state === route.state);
    if (root) {
        root.children = route.children;
    }
}

function parseRoutesState(route: Route, prefix: string) {
    route.children.filter(child => !!child.state).forEach(child => child.state = `${prefix}.${child.state}`);
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

