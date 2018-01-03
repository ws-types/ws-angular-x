"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var compilers_1 = require("./../../compilers");
var reflect_1 = require("../../compilers/features/reflect");
var errors_1 = require("./../../utils/errors");
var config_1 = require("./../config/config");
var router_service_1 = require("../services/router.service");
var angularjs_1 = require("@uirouter/angularjs");
var router_outlet_directive_1 = require("./../directives/router-outlet.directive");
exports.uirouter = new compilers_1.ModuleGenerator("ui.router");
var mdconfig = {
    imports: [exports.uirouter],
    providers: [router_service_1.Router],
    declarations: [router_outlet_directive_1.RouterOutletDirective]
};
var RouterModule = (function () {
    function RouterModule() {
        this.childRouters = [];
        // console.log(DI.Providers);
        // console.log(DI.GetValue(uirouter_stamp));
        if (reflect_1.DI.GetValue(config_1.uirouter_stamp)) {
            return;
        }
        reflect_1.DI.Register(config_1.uirouter_stamp, this);
    }
    RouterModule_1 = RouterModule;
    RouterModule.forRoot = function (routes, config) {
        if (!routes) {
            throw errors_1.RoutersConfigUndefinedError();
        }
        var router = getRouterModule();
        if (!router.mainRouters) {
            router.mainRouters = routes;
            // 为第一级级路由条目解析组件
            parseRoutesComponent(routes);
            // 为二级路由寻找顶级路由，并挂钩到children
            hookChildrenRoutes(router);
            // 清空二级路由，因为已经完成挂钩
            router.childRouters = [];
        }
        else {
            throw errors_1.RouterRootDuplicatedError();
        }
        return compilers_1.$NgModule(mdconfig).Decorate(RouterModule_1);
    };
    RouterModule.forChild = function (routes) {
        var router = getRouterModule();
        // 添加二级路由或低级路由组
        router.childRouters.push(routes);
        return compilers_1.$NgModule(mdconfig).Decorate(RouterModule_1);
    };
    RouterModule.prototype.configRoutes = function (state, urlProvider) {
        var states = [];
        var router = getRouterModule();
        var mains = router.mainRouters;
        mains.forEach(function (subRt) { return setStates(subRt, state, states, urlProvider); });
        // default home url
        var home = mains.find(function (i) { return !i.state && i.path === ""; });
        if (home) {
            var redrect = states.find(function (ind) { return ind.state === home.redirectTo; });
            if (!redrect) {
                throw errors_1.RoutersDefaultHomeUndefinedError();
            }
            else {
                home.state = "__default";
                home.path = "";
                home.redirectTo = redrect.state;
            }
            setState(state, home, states, urlProvider);
        }
        // default otherwise url
        var otherwise = mains.find(function (i) { return !i.state && i.path === "**"; });
        if (otherwise && otherwise.redirectToPath) {
            otherwise.state = "__otherwise";
            setState(state, otherwise, states, urlProvider);
        }
        else {
            throw errors_1.OtherwiseRoutesDefineError();
        }
        router.routesConfig = states;
    };
    RouterModule.$inject = [];
    __decorate([
        compilers_1.Config("$stateProvider", "$urlRouterProvider"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [angularjs_1.StateProvider, angularjs_1.UrlRouterProvider]),
        __metadata("design:returntype", void 0)
    ], RouterModule.prototype, "configRoutes", null);
    RouterModule = RouterModule_1 = __decorate([
        compilers_1.NgModule(mdconfig),
        __metadata("design:paramtypes", [])
    ], RouterModule);
    return RouterModule;
    var RouterModule_1;
}());
exports.RouterModule = RouterModule;
function hookChildrenRoutes(router) {
    router.childRouters.forEach(function (route) {
        var prefix = route.state;
        var path = route.path;
        if (!path || !prefix) {
            throw errors_1.SubRoutesNoPathError();
        }
        parseRoutesState(route, prefix);
        parseRoutesComponent(route.children);
        parseRoutesParent(router, route);
    });
}
function setStates(subRt, state, savings, urlProvider) {
    setState(state, subRt, savings, urlProvider);
    if (subRt.children && subRt.children.length !== 0) {
        subRt.children.forEach(function (smRt) { return setStates(smRt, state, savings, urlProvider); });
    }
}
function setState(state, subRt, savings, urlProvider) {
    if (subRt.state) {
        var path = checkIfAbsolutePath(subRt);
        var redirect = subRt.redirectTo;
        var abst = false;
        if (subRt.state === "__otherwise") {
            path = "";
            redirect = "handle => " + subRt.redirectToPath;
            abst = true;
            try {
                urlProvider.otherwise(subRt.redirectToPath);
            }
            catch (e) {
                throw errors_1.OtherwiseRoutesDefineError();
            }
        }
        var comp = subRt.component;
        var params = subRt.params || [];
        var config_2 = {
            name: subRt.state,
            url: path,
            redirectTo: redirect,
            abstract: abst
        };
        if (comp) {
            config_2.component = comp;
        }
        if (params.length > 0) {
            config_2.params = {};
            params.forEach(function (name) { return config_2.params[name] = ""; });
        }
        state.state(config_2);
        var sv = {
            state: config_2.name,
            url: config_2.url
        };
        if (config_2.component) {
            sv.component = config_2.component;
        }
        if (config_2.redirectTo) {
            sv.redirect = config_2.redirectTo;
        }
        savings.push(sv);
    }
}
function checkIfAbsolutePath(subRt) {
    if (subRt.path) {
        if (subRt.path.substring(0, 1) === "/") {
            return "^" + subRt.path;
        }
        else {
            return "/" + subRt.path;
        }
    }
    else {
        return "";
    }
}
function parseRoutesParent(router, route) {
    var root = router.mainRouters.find(function (i) { return i.state === route.state; });
    if (root) {
        root.children = route.children;
        root.path = route.path;
        root.redirectTo = root.state + ".__default";
    }
}
function parseRoutesState(route, prefix) {
    var these = route.children.filter(function (child) { return !!child.state; });
    these.forEach(function (child) {
        child.state = prefix + "." + child.state;
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
function setRedirect(route, these, prefix, filter) {
    var df = route.children.filter(function (child) { return !child.state && child.path === filter; })[0];
    if (df) {
        if (df.redirectTo) {
            var found = these.find(function (i) { return i.state === prefix + "." + df.redirectTo; });
            if (found) {
                df.state = prefix + "." + (filter || "__default");
                df.path = filter;
                df.redirectTo = found.state;
            }
            else {
                df.state = prefix + "." + (filter || "__default");
                df.path = filter;
            }
        }
    }
}
function parseRoutesComponent(routes) {
    routes.filter(function (child) { return !!child.component; }).forEach(function (child) {
        if (typeof (child.component) !== "string") {
            if ((child.component).generator) {
                child.component = (child.component).generator.Selector;
            }
            else {
                child.component = (child.component).Selector;
            }
        }
    });
}
function getRouterModule() {
    var instance;
    if (!reflect_1.DI.GetValue(config_1.uirouter_stamp)) {
        instance = new RouterModule();
    }
    else {
        instance = reflect_1.DI.GetValue(config_1.uirouter_stamp);
    }
    return instance;
}
//# sourceMappingURL=module.js.map