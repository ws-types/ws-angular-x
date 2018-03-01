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
var CompileService = /** @class */ (function () {
    function CompileService($compile) {
        this.$compile = $compile;
    }
    CompileService.prototype.link = function (element, scope, transclude, maxPriority, cloneAttachFn, options) {
        return this.$compile(element, transclude, maxPriority)(scope, cloneAttachFn, options);
    };
    CompileService = __decorate([
        provider_1.Injectable("@compile"),
        __metadata("design:paramtypes", [Function])
    ], CompileService);
    return CompileService;
}());
exports.CompileService = CompileService;
//# sourceMappingURL=compile.service.js.map