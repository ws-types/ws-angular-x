import "reflect-metadata";
import { IComponentConfig, IComponentClass } from "@angular/metadata";
import { CreateComponent } from "./../creators";
import { InputMetaKey, OutputMetaKey, IInputProperty } from "./others";
import { ComponentGenerator } from "./../generators";
import { EventEmitter } from "./../features/emit";

export function Component(config: IComponentConfig) {
    return function compoDecorator<T extends IComponentClass>(target: T) {
        const generator = CreateComponent(config);
        const maps = parseLifeCycleHooks(target.prototype);
        const outputs = parseIOProperties(target.prototype, generator);
        class ComponentClass extends target {
            constructor(...params: any[]) {
                super(...params);
                outputs.forEach(emit => this[emit] = new EventEmitter<any>(this[emit]));
                generator.StylesLoad();
                if (maps.ngOnInit) {
                    this.$onInit = maps.ngOnInit;
                }
                if (maps.ngOnDestroy) {
                    this.$onDestroy = maps.ngOnDestroy;
                }
            }
        }
        generator.Class(ComponentClass);
        target.generator = generator;
    };
}

function parseLifeCycleHooks(proto: any) {
    const maps: { [name: string]: (...params: any[]) => void } = {};
    Object.getOwnPropertyNames(proto).forEach(name => {
        const propery = proto[name];
        if (name === "ngOnInit" || name === "ngOnDestroy") {
            maps[name] = propery;
        }
    });
    return maps;
}

function parseIOProperties(proto: any, generator: ComponentGenerator) {
    const outputs: string[] = [];
    const IOKeys = Reflect.getMetadataKeys(proto);
    IOKeys.forEach(key => {
        (Reflect.getMetadata(key, proto) as any[]).forEach(prop => {
            if (key === InputMetaKey) {
                const input = prop as IInputProperty;
                generator.Input(input.keyName, !input.isString);
            } else if (key === OutputMetaKey) {
                generator.Output(prop);
                outputs.push(prop);
            }
        });
    });
    return outputs;
}

