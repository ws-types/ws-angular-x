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
var uuid = require("uuid/v4");
var camelCase = require("camelcase");
var compilers_1 = require("./../../compilers");
var errors_1 = require("./../../utils/errors");
var container_1 = require("../../di/container");
var config_1 = require("./../config/config");
var router_service_1 = require("../services/router.service");
var angularjs_1 = require("@uirouter/angularjs");
var router_outlet_directive_1 = require("./../directives/router-outlet.directive");
exports.uirouter = new compilers_1.ModuleGenerator("ui.router");
exports.oclazyload = new compilers_1.ModuleGenerator("oc.lazyLoad");
var mdconfig = {
    imports: [exports.uirouter, exports.oclazyload],
    providers: [router_service_1.Router],
    declarations: [router_outlet_directive_1.RouterOutletDirective]
};
var RouterModule = /** @class */ (function () {
    function RouterModule() {
        this.childRouters = [];
        if (container_1.DI.GetValue(config_1.uirouter_stamp)) {
            return;
        }
        container_1.DI.Register(config_1.uirouter_stamp, this);
    }
    RouterModule_1 = RouterModule;
    Object.defineProperty(RouterModule.prototype, "RoutesList", {
        get: function () { return this._routesConfig; },
        enumerable: true,
        configurable: true
    });
    RouterModule.forRoot = function (routes, config) {
        if (!routes) {
            throw errors_1.RoutersConfigUndefinedError();
        }
        var router = RouterHandler.GetRouterModule();
        if (!router.mainRouters) {
            routes.forEach(function (route) { return RouterHandler.BuildStateUnique(route); });
            router.mainRouters = routes;
            RouterHandler.ParseRoutesLazyload(routes);
            RouterHandler.ParseRoutesComponent(routes);
            router.childRouters = [];
        }
        else {
            throw errors_1.RouterRootDuplicatedError();
        }
        return compilers_1.$NgModule(mdconfig).Decorate(RouterModule_1);
    };
    RouterModule.forChild = function (childRoute) {
        return LazyLoadHandler.ConfLazyRouterConfig(childRoute);
    };
    RouterModule.prototype.configRoutes = function (state, urlProvider) {
        var states = [];
        var router = RouterHandler.GetRouterModule();
        var mains = router.mainRouters;
        mains.forEach(function (subRt) { return RouterHandler.SetStates(subRt, state, states, urlProvider); });
        RouterHandler.ConfDefaultHome(mains, state, states, urlProvider);
        RouterHandler.ConfDefaultOtherwise(mains, state, states, urlProvider);
        router._routesConfig = states;
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
var default_devide = "$DEFAULT_DEVIDE_STAMP_USED_INNER$";
var impossible_url = "$IMPOSSIBLE_ROUTER_PATH$";
var default_otherwise = "__otherwise";
var default_home = "__default";
var empty_path = "";
var RouterHandler = /** @class */ (function () {
    function RouterHandler() {
    }
    RouterHandler.GetRouterModule = function () {
        var instance;
        if (!container_1.DI.GetValue(config_1.uirouter_stamp)) {
            instance = new RouterModule();
        }
        else {
            instance = container_1.DI.GetValue(config_1.uirouter_stamp);
        }
        return instance;
    };
    RouterHandler.ConfDefaultOtherwise = function (mains, state, states, urlProvider) {
        var otherwise = mains.find(function (i) { return !i.state && i.path === "**"; });
        if (otherwise && otherwise.redirectToPath) {
            otherwise.state = default_otherwise;
            RouterHandler.SetState(state, otherwise, states, urlProvider);
        }
        else {
            throw errors_1.OtherwiseRoutesDefineError();
        }
    };
    RouterHandler.ConfDefaultHome = function (mains, state, states, urlProvider) {
        var home = mains.find(function (i) { return !i.state && i.path === ""; });
        if (home) {
            var redrect = mains.find(function (ind) { return ind.state === home.redirectTo; });
            if (!redrect) {
                redrect = mains.find(function (nnd) { return nnd.path === home.redirectTo; });
                if (!redrect) {
                    throw errors_1.RoutersDefaultHomeUndefinedError();
                }
                else {
                    home.state = default_home;
                    home.path = empty_path;
                    home.redirectTo = redrect.state;
                }
            }
            else {
                home.state = default_home;
                home.path = empty_path;
                home.redirectTo = redrect.state;
            }
            RouterHandler.SetState(state, home, states, urlProvider);
        }
    };
    RouterHandler.BuildStateUnique = function (subRt) {
        if (!subRt.state && subRt.path !== "" && subRt.path !== "**" && !subRt.path.startsWith("?")) {
            // return;
            subRt.state = (subRt.path || "E") + "_" + camelCase(uuid());
            // console.log(subRt.state);
        }
    };
    RouterHandler.SetStates = function (subRt, state, savings, urlProvider) {
        RouterHandler.SetState(state, subRt, savings, urlProvider);
        if (subRt.children && subRt.children.length !== 0) {
            subRt.children.forEach(function (smRt) { return RouterHandler.SetStates(smRt, state, savings, urlProvider); });
        }
    };
    RouterHandler.SetState = function (state, subRt, savings, urlProvider) {
        if (!subRt.state) {
            return;
        }
        subRt.path = (!subRt.path && subRt.path !== "") ? subRt.state : subRt.path;
        var config = {
            name: subRt.state,
            url: RouterHandler.CheckIfAbsolutePath(subRt),
            redirectTo: subRt.redirectTo,
            abstract: false
        };
        if (subRt.parent) {
            config.parent = subRt.parent;
        }
        if (subRt.loadChildren) {
            config.lazyLoad = function ($transition$, $state) {
                var $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");
                return subRt.loadChildren().then(function (module) {
                    var generator = module.generator;
                    generator.RunLazyLoads(function (lazy) {
                        if (lazy._ngModuleLazyConfig) {
                            lazy._ngModuleLazyConfig(subRt.parent, [subRt.state.replace(".**", ""), subRt.path], generator);
                        }
                    });
                    return $ocLazyLoad.load(generator.Build());
                });
            };
        }
        else {
            if (subRt.state === default_otherwise) {
                config.url = impossible_url;
                config.redirectTo = "handle => " + subRt.redirectToPath;
                config.abstract = true;
                try {
                    urlProvider.otherwise(subRt.redirectToPath);
                }
                catch (e) {
                    throw errors_1.OtherwiseRoutesDefineError();
                }
            }
            var comp = subRt.component;
            var params = subRt.params || [];
            if (comp) {
                config.component = comp;
            }
            if (params.length > 0) {
                config.params = {};
                params.forEach(function (name) { return config.params[name] = {
                    value: null,
                    dynamic: true
                }; });
            }
        }
        if (state instanceof angularjs_1.StateProvider) {
            state.state(config);
        }
        else {
            state.register(config);
        }
        var sv = { url: config.url };
        if (config.url === impossible_url) {
            sv.url = "**";
        }
        if (config.component) {
            sv.component = config.component;
        }
        if (config.params) {
            sv.dynamicParams = subRt.params;
        }
        if (config.redirectTo) {
            sv.redirect = config.redirectTo;
        }
        sv.state = config.name;
        findAndInsertToFinallyHost(sv, savings, (config.parent || sv.state) + ".**");
    };
    RouterHandler.CheckIfAbsolutePath = function (subRt) {
        if (subRt.path) {
            if (subRt.path.substring(0, 1) === "/") {
                return "^" + subRt.path;
            }
            else if (subRt.path.toString().includes(default_devide)) {
                return "/" + subRt.path.toString().replace(default_devide, "");
            }
            else {
                return "/" + subRt.path;
            }
        }
        else {
            return empty_path;
        }
    };
    RouterHandler.ParseRoutesState = function (route, pre_states) {
        var hasParent = false;
        if (pre_states) {
            route.parent = pre_states[0], _a = pre_states[1], route.state = _a[0], route.path = _a[1];
            if (route.parent) {
                hasParent = true;
            }
        }
        else {
            var coll = route.state.split(".");
            route.state = coll[coll.length - 1];
            if (coll.length > 1) {
                hasParent = true;
                route.parent = coll[coll.length - 2];
            }
        }
        var these = route.children.filter(function (child) { return !!child.state; });
        these.forEach(function (child) {
            child.parent = route.state;
        });
        // set local route level's default redirect.
        RouterHandler.SetRedirect(route, these, hasParent ? route.parent : null, route.state);
        var _a;
    };
    RouterHandler.SetRedirect = function (route, these, prefix, subPre) {
        var df = route.children.filter(function (child) { return !child.state && (child.path === "" || child.path.startsWith("?")); })[0];
        if (df) {
            if (df.redirectTo) {
                var found = these.find(function (i) { return i.state === df.redirectTo; });
                if (found) {
                    df.state = route.state;
                    df.path = route.path || route.state;
                    df.redirectTo = found.state;
                }
                else {
                    found = these.find(function (i) { return i.path === df.redirectTo; });
                    if (found) {
                        df.state = route.state;
                        df.path = route.path || route.state;
                        df.redirectTo = found.state;
                    }
                    else {
                        // redirect to out routes level, ignore checks.
                        df.state = route.state;
                        df.path = route.path || route.state;
                    }
                }
                if (prefix) {
                    df.parent = prefix;
                }
                // empty routes config
                route.children.push({
                    state: "__current_redirect_" + camelCase(uuid()),
                    path: default_devide,
                    redirectTo: df.redirectTo,
                    parent: subPre
                });
            }
            else if (df.component) {
                // default level-index component
                var pathCache = df.path;
                df.state = route.state;
                df.path = (route.path || route.state) + df.path;
                if (prefix) {
                    df.parent = prefix;
                }
                var currentIndex = {
                    state: "__current_index_" + camelCase(uuid()),
                    component: df.component,
                    path: default_devide + pathCache,
                    parent: subPre
                };
                if (df.params) {
                    currentIndex.params = df.params;
                }
                route.children.push(currentIndex);
            }
        }
    };
    RouterHandler.ParseRoutesComponent = function (routes) {
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
    };
    RouterHandler.ParseRoutesLazyload = function (routes) {
        routes.filter(function (child) { return !!child.loadChildren; }).forEach(function (child) {
            child.path = child.path || child.state;
            child.state = child.state + ".**";
        });
    };
    return RouterHandler;
}());
exports.RouterHandler = RouterHandler;
var LazyLoadHandler = /** @class */ (function () {
    function LazyLoadHandler() {
    }
    LazyLoadHandler.ConfLazyRouterConfig = function (childRoute) {
        var router = RouterHandler.GetRouterModule();
        return {
            _ngPayload: {
                _ngModuleLazyConfig: function (pre_state, current, generator) {
                    generator.LazyConfig(["$stateRegistryProvider", function (provider) {
                            childRoute.children.forEach(function (i) { return RouterHandler.BuildStateUnique(i); });
                            RouterHandler.ParseRoutesState(childRoute, [pre_state, current]);
                            RouterHandler.ParseRoutesComponent(childRoute.children);
                            RouterHandler.ParseRoutesLazyload(childRoute.children);
                            childRoute.children.forEach(function (subRt) {
                                var prefix = subRt.state;
                                if (!prefix) {
                                    throw errors_1.SubRoutesNoPathError();
                                }
                                RouterHandler.SetStates(subRt, provider, router.RoutesList, null);
                            });
                        }]);
                }
            },
            _ngConfig: [],
            _ngInvokers: []
        };
    };
    return LazyLoadHandler;
}());
exports.LazyLoadHandler = LazyLoadHandler;
function findTreeHost(svs, state_target) {
    var prt = svs.find(function (i) { return i.state === state_target; });
    if (prt) {
        return prt;
    }
    else {
        var new_svs = svs.filter(function (i) { return !!i.children; });
        if (new_svs.length === 0) {
            return null;
        }
        else {
            var one = void 0;
            for (var _i = 0, new_svs_1 = new_svs; _i < new_svs_1.length; _i++) {
                var item = new_svs_1[_i];
                var target = findTreeHost(item.children, state_target);
                if (target) {
                    one = target;
                }
                if (one) {
                    break;
                }
            }
            return one;
        }
    }
}
function findAndInsertToFinallyHost(s, svs, state_target) {
    var prt = findTreeHost(svs, state_target);
    if (prt) {
        if (s.state + ".**" === prt.state) {
            s.url = s.url.replace(prt.url, "");
        }
        if (prt.children) {
            findAndInsertToFinallyHost(s, prt.children, s.state + ".**");
        }
        else {
            prt.children = [];
            prt.children.push(s);
        }
    }
    else {
        svs.push(s);
    }
}
//# sourceMappingURL=module.js.map