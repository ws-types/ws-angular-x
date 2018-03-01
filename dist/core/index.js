"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("angular");
__export(require("./template/templateRef"));
__export(require("./template/elementRef"));
__export(require("./services/compile.service"));
var module_1 = require("./../compilers/decoretors/module");
var compile_service_1 = require("./services/compile.service");
var ng_template_directive_1 = require("./template/ng-template.directive");
var i18n_1 = require("../i18n");
var CoreModule = /** @class */ (function () {
    function CoreModule() {
    }
    CoreModule = __decorate([
        module_1.NgModule({
            selector: "ws-angular-x-v1",
            imports: [],
            providers: [
                {
                    provide: i18n_1.NGX_I18N_CONFIG,
                    useValue: {
                        locale: "en-US",
                        default: "en-Us"
                    }
                },
                compile_service_1.CompileService,
            ],
            declarations: [
                ng_template_directive_1.NgTemplateOutletDirective,
            ]
        })
    ], CoreModule);
    return CoreModule;
}());
function browserDynamic(selector) {
    if (selector === void 0) { selector = "html"; }
    return {
        bootstrapModule: function (module) {
            var deps = [CoreModule.generator.Build().name];
            if (module) {
                var generator = void 0;
                if (module.generator) {
                    generator = module.generator;
                }
                else {
                    generator = module;
                }
                deps.push(generator.Build().name);
            }
            angular.bootstrap(angular.element(document.getElementsByTagName(selector)), deps);
        }
    };
}
exports.browserDynamic = browserDynamic;
//# sourceMappingURL=index.js.map