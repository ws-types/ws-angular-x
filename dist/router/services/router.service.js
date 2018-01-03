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
var provider_1 = require("../../compilers/decoretors/provider");
var Subject_1 = require("rxjs/Subject");
var angularjs_1 = require("@uirouter/angularjs");
var config_1 = require("./../config/config");
var reflect_1 = require("./../../compilers/features/reflect");
var Router = (function () {
    function Router(state, transitions) {
        this.state = state;
        this.transitions = transitions;
        this._params = new Subject_1.Subject();
        this._stateChanges = new Subject_1.Subject();
        this._errorsOcc = new Subject_1.Subject();
        this.initHooks();
    }
    Object.defineProperty(Router.prototype, "RoutesTree", {
        get: function () {
            var rtmd = reflect_1.DI.GetValue(config_1.uirouter_stamp);
            return !rtmd ? null : rtmd.routesConfig;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "params", {
        get: function () { return this._params; },
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
            _this._stateChanges.next(transitions.to());
            _this._params.next(transitions.params("to"));
        });
        this.transitions.onError({}, function (transtions) {
            _this._errorsOcc.next(transtions.error());
        });
    };
    Router.prototype.GoTo = function (state, params) {
        this.state.go(state, params);
    };
    Router.$inject = ["$state", "$transitions"];
    Router = __decorate([
        provider_1.Injectable("@router"),
        __metadata("design:paramtypes", [angularjs_1.StateService, angularjs_1.Transition])
    ], Router);
    return Router;
}());
exports.Router = Router;
//# sourceMappingURL=router.service.js.map