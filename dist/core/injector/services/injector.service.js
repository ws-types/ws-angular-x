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
var container_1 = require("../../../di/container");
var compilers_1 = require("./../../../compilers");
var InjectorService = /** @class */ (function () {
    function InjectorService(injector) {
        this.injector = injector;
    }
    InjectorService.prototype.Get = function (v) {
        var key;
        if (typeof (v) !== "string") {
            key = container_1.DI.GetKey(v);
        }
        else {
            key = v;
        }
        return this.injector.has(key) ? this.injector.get(key) : null;
    };
    InjectorService.$inject = ["$injector"];
    InjectorService = __decorate([
        compilers_1.Injectable("@injector"),
        __metadata("design:paramtypes", [Object])
    ], InjectorService);
    return InjectorService;
}());
exports.InjectorService = InjectorService;
//# sourceMappingURL=injector.service.js.map