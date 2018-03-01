"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var provider_1 = require("./../compilers/decoretors/provider");
var config_1 = require("./config");
exports.I18N_SELECTOR = config_1.I18N_SELECTOR;
var NGX_I18N_CONFIG = /** @class */ (function () {
    // tslint:disable-next-line:class-name
    function NGX_I18N_CONFIG() {
    }
    Object.defineProperty(NGX_I18N_CONFIG.prototype, "Locale", {
        get: function () { return this.locale || this.default; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NGX_I18N_CONFIG.prototype, "Default", {
        get: function () { return this.default; },
        enumerable: true,
        configurable: true
    });
    NGX_I18N_CONFIG = __decorate([
        provider_1.Injectable(config_1.I18N_SELECTOR)
        // tslint:disable-next-line:class-name
    ], NGX_I18N_CONFIG);
    return NGX_I18N_CONFIG;
}());
exports.NGX_I18N_CONFIG = NGX_I18N_CONFIG;
//# sourceMappingURL=index.js.map