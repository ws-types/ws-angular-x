import * as angular from "angular";
export * from "./template/templateRef";
export * from "./template/elementRef";
export * from "./services/compile.service";

import { Ng2Module, IModuleClass, IModuleGenerator } from "./../metadata";
import { NgModule } from "./../compilers/decoretors/module";
import { CompileService } from "./services/compile.service";
import { NgTemplateOutletDirective } from "./template/ng-template.directive";
import { NGX_I18N_CONFIG } from "../i18n";

@NgModule({
    selector: "ws-angular-x-v1",
    imports: [],
    providers: [
        {
            provide: NGX_I18N_CONFIG,
            useValue: {
                locale: "en-US",
                default: "en-Us"
            }
        },
        CompileService,
    ],
    declarations: [
        NgTemplateOutletDirective,
    ]
})
class CoreModule {

}

export function browserDynamic(selector = "html") {
    return {
        bootstrapModule: function (module?: Ng2Module) {
            const deps: string[] = [(CoreModule as any).generator.Build().name];
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
