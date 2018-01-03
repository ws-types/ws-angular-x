import { NgModule, ModuleGenerator } from "./../../compilers";

const AnimationsModule = new ModuleGenerator("ngAnimate");

@NgModule({
    imports: [AnimationsModule]
})
export class BrowserAnimationsModule {

}
