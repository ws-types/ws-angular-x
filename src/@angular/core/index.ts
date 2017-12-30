import * as angular from "angular";
import * as $ from "jquery";

const CoreModule = angular.module("ws-angular-x-v1", []);

export function browserDynamic() {
    return {
        bootstrapModule: function (module?: ng.IModule) {
            const deps = [CoreModule.name];
            if (module) {
                deps.push(module.name);
            }
            angular.bootstrap($("html"), deps);
        }
    };
}
