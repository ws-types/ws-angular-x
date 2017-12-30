import { IComponentConfig, IComponentClass } from "@angular/metadata";
import { CreateComponent } from "./../creators";

export function Component(config: IComponentConfig) {
    return function decorator<T extends IComponentClass>(target: T) {
        const generator = CreateComponent(config);
        const proto = target.prototype;
        const maps: { [name: string]: (...params: any[]) => void } = {};
        Object.getOwnPropertyNames(proto).forEach(name => {
            const propery = proto[name];
            if (name === "ngOnInit" || name === "ngOnDestroy") {
                maps[name] = propery;
            }
        });
        class ComponentClass extends target {
            constructor(...params: any[]) {
                super(...params);
                generator.StylesLoad();
                if (maps.ngOnInit) {
                    this.$onInit = maps.ngOnInit;
                }
            }
        }
        generator.Class(ComponentClass);
        target.generator = generator;
    };
}
