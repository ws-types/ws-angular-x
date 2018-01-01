import { NgModule, ModuleGenerator } from "@angular";

const AnimationsModule = new ModuleGenerator("ngAnimate");

@NgModule({
    imports: [AnimationsModule]
})
export class BrowserAnimationsModule {

}
