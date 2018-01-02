"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("angular");
var $ = require("jquery");
var CoreModule = angular.module("ws-angular-x-v1", []);
function browserDynamic(selector) {
    if (selector === void 0) { selector = "html"; }
    return {
        bootstrapModule: function (module) {
            var deps = [CoreModule.name];
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
            angular.bootstrap($(selector), deps);
        }
    };
}
exports.browserDynamic = browserDynamic;
//# sourceMappingURL=index.js.map