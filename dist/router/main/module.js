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
var _angular_1 = require("@angular");
var reflect_1 = require("../../compilers/features/reflect");
var errors_1 = require("@angular/utils/errors");
var config_1 = require("./../config/config");
var router_service_1 = require("@angular/router/services/router.service");
var angularjs_1 = require("@uirouter/angularjs");
var router_outlet_directive_1 = require("@angular/router/directives/router-outlet.directive");
exports.uirouter = new _angular_1.ModuleGenerator("ui.router");
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
            parseRoutesComponent(routes);
            router.childRouters.forEach(function (route) {
                var prefix = route.state;
                if (prefix) {
                    parseRoutesState(route, prefix);
                    parseRoutesComponent(route.children);
                    parseRoutesParent(router, route);
                }
            });
            router.childRouters = [];
        }
        else {
            throw errors_1.RouterRootDuplicatedError();
        }
        return _angular_1.$NgModule(mdconfig).Decorate(RouterModule_1);
    };
    RouterModule.forChild = function (routes) {
        var router = getRouterModule();
        router.childRouters.push(routes);
        return _angular_1.$NgModule(mdconfig).Decorate(RouterModule_1);
    };
    RouterModule.prototype.configRoutes = function (state, urlProvider) {
        // console.log("conf routers #########");
        var states = [];
        var router = getRouterModule();
        var mains = router.mainRouters;
        var home = mains.find(function (i) { return !i.state && i.path === ""; });
        if (home) {
            var redrect = mains.find(function (ind) { return ind.state === home.redirectTo; });
            urlProvider.otherwise(!redrect ? "/" : redrect.path);
        }
        mains.forEach(function (subRt) { return setStates(subRt, state, states); });
        router.routesConfig = states;
        // console.log(router);
        // console.log("######################");
    };
    RouterModule.$inject = [];
    __decorate([
        _angular_1.Config("$stateProvider", "$urlRouterProvider"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [angularjs_1.StateProvider, angularjs_1.UrlRouterProvider]),
        __metadata("design:returntype", void 0)
    ], RouterModule.prototype, "configRoutes", null);
    RouterModule = RouterModule_1 = __decorate([
        _angular_1.NgModule(mdconfig),
        __metadata("design:paramtypes", [])
    ], RouterModule);
    return RouterModule;
    var RouterModule_1;
}());
exports.RouterModule = RouterModule;
function setStates(subRt, state, savings) {
    if (!subRt.children || subRt.children.length === 0) {
        setState(state, subRt, savings);
    }
    else {
        subRt.children.forEach(function (smRt) { return setStates(smRt, state, savings); });
    }
}
function setState(state, subRt, savings) {
    if (subRt.state) {
        var comp = subRt.component;
        var params = subRt.params || [];
        var config_2 = {
            name: subRt.state,
            url: subRt.path ? "/" + subRt.path : "",
            redirectTo: subRt.redirectTo
        };
        if (comp) {
            config_2.component = comp;
        }
        else {
            config_2.abstract = true;
        }
        if (params.length > 0) {
            config_2.params = {};
            params.forEach(function (name) { return config_2.params[name] = ""; });
        }
        state.state(config_2);
        savings.push(config_2);
    }
}
function parseRoutesParent(router, route) {
    var root = router.mainRouters.find(function (i) { return i.state === route.state; });
    if (root) {
        root.children = route.children;
    }
}
function parseRoutesState(route, prefix) {
    route.children.filter(function (child) { return !!child.state || child.path === ""; }).forEach(function (child) {
        if (child.path === "") {
            child.state = prefix; // for redirect .
        }
        else {
            child.state = prefix + "." + child.state;
        }
    });
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