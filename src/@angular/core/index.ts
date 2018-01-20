import * as angular from "angular";

import { Ng2Module, IModuleClass, IModuleGenerator } from "./../metadata";

const CoreModule = angular.module("ws-angular-x-v1", []);

export function browserDynamic(selector = "html") {
    return {
        bootstrapModule: function (module?: Ng2Module) {
            const deps = [CoreModule.name];
            if (module) {
                let generator: IModuleGenerator;
                if ((<IModuleClass>module).generator) {
                    generator = (module as IModuleClass).generator;
                } else {
                    generator = module as IModuleGenerator;
                }
                deps.push(generator.Build().name);
            }
            angular.bootstrap(angular.element(document.getElementsByTagName(selector)), deps);
        }
    };
}
