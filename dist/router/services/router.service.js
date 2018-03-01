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
var container_1 = require("../../di/container");
var provider_1 = require("../../compilers/decoretors/provider");
var Subject_1 = require("rxjs/Subject");
var angularjs_1 = require("@uirouter/angularjs");
var config_1 = require("./../config/config");
var Router = /** @class */ (function () {
    function Router(state, transitions, $location) {
        this.state = state;
        this.transitions = transitions;
        this.$location = $location;
        this._stateChanges = new Subject_1.Subject();
        this._errorsOcc = new Subject_1.Subject();
        this.routerModule = container_1.DI.GetValue(config_1.uirouter_stamp);
        this.initHooks();
    }
    Object.defineProperty(Router.prototype, "RoutesTree", {
        get: function () { return this.routerModule.RoutesList; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "RoutesConfig", {
        get: function () {
            var final = [];
            var parser = function (target, tree) {
                tree.forEach(function (t) {
                    var newt = { path: t.url };
                    if (t.component) {
                        newt.component = t.component;
                    }
                    if (t.state.includes(".**")) {
                        newt.lazyLoaded = !t.children ? false : true;
                    }
                    if (t.redirect) {
                        var tgt = tree.find(function (i) { return i.state === t.redirect; });
                        newt.redirect = (tgt && tgt.url) || t.redirect;
                    }
                    if (t.children) {
                        newt.children = [];
                        parser(newt.children, t.children);
                    }
                    target.push(newt);
                });
            };
            parser(final, this.routerModule.RoutesList);
            return JSON.stringify(final, null, "\t");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "stateChanges", {
        get: function () { return this._stateChanges; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "errors", {
        get: function () { return this._errorsOcc; },
        enumerable: true,
        configurable: true
    });
    Router.prototype.initHooks = function () {
        var _this = this;
        this.transitions.onSuccess({}, function (transitions) {
            _this._stateChanges.next({
                from: transitions.from(),
                to: transitions.to(),
                params: transitions.params("to"),
                url: _this.$location.path()
            });
        });
        this.transitions.onError({}, function (transtions) {
            var error = transtions.error();
            if (typeof (error) === "string") {
                _this._errorsOcc.next(error);
            }
        });
    };
    Router.prototype.GoTo = function (state, params) {
        this.state.go(state, params);
    };
    Router.prototype.navigate = function (url, params, replace) {
        if (params === void 0) { params = {}; }
        if (replace === void 0) { replace = false; }
        var action;
        if (url instanceof Array) {
            url[0] = url[0].startsWith("/") ? url[0] : "/" + url[0];
            action = this.$location.path(url.join("/")).search(params || {});
        }
        else {
            action = this.$location.path(url.startsWith("/") ? url : "/" + url).search(params || {});
        }
        if (replace === true) {
            action.replace();
        }
    };
    Router.$inject = ["$state", "$transitions", "$location"];
    Router = __decorate([
        provider_1.Injectable("@router"),
        __metadata("design:paramtypes", [angularjs_1.StateService, angularjs_1.Transition, Object])
    ], Router);
    return Router;
}());
exports.Router = Router;
//# sourceMappingURL=router.service.js.map