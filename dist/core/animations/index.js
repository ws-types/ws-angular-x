"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var compilers_1 = require("./../../compilers");
var AnimationsModule = new compilers_1.ModuleGenerator("ngAnimate");
var BrowserAnimationsModule = /** @class */ (function () {
    function BrowserAnimationsModule() {
    }
    BrowserAnimationsModule = __decorate([
        compilers_1.NgModule({
            imports: [AnimationsModule]
        })
    ], BrowserAnimationsModule);
    return BrowserAnimationsModule;
}());
exports.BrowserAnimationsModule = BrowserAnimationsModule;
//# sourceMappingURL=index.js.map