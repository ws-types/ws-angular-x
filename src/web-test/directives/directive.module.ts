import { NgModule, Config } from "@angular";
import { NewDirective } from "@src/directives/dire01/new.directive";
import { AntDirective } from "@src/directives/dire02/ant.directive";


@NgModule({
    imports: [],
    declarations: [
        NewDirective,
        AntDirective
    ],
    providers: []
})
export class DirectivesModule {

    @Config()
    public config($httpProvider) {
        // console.log($httpProvider);
    }

}
