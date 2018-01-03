import "reflect-metadata";
import { IComponentConfig, IComponentClass } from "./../../metadata";
import { CreateComponent } from "./../creators";
import { InputMetaKey, OutputMetaKey, IInputProperty, ParamsTypeMetaKey } from "./others";
import { ComponentGenerator } from "./../generators";
import { EventEmitter } from "./../features/emit";
import { parseInjectsAndDI } from "./provider";

export function Component(config: IComponentConfig) {
    return function compoDecorator<T extends IComponentClass>(target: T) {
        const generator = createExtends(target, config);
        target.generator = generator;
    };
}

export function $Component(config: IComponentConfig) {
    return {
        Decorate: <T extends IComponentClass>(target: T): T => {
            const generator = createExtends(target, config);
            target.generator = generator;
            return target;
        }
    };
}

function createExtends<T extends IComponentClass>(target: T, config: IComponentConfig) {
    const generator = CreateComponent(config);
    const maps = parseLifeCycleHooks(target.prototype);
    const outputs = parseIOProperties(target.prototype, generator);
    const injects = createInjects(target);
    class ComponentClass extends target {
        public static $inject = injects;
        constructor(...args: any[]) {
            super(...args);
            outputs.forEach(emit => this[emit] = new EventEmitter<any>(this[emit]));
            if (maps.ngOnInit) {
                this.$onInit = maps.ngOnInit;
            }
            if (maps.ngOnDestroy) {
                this.$onDestroy = maps.ngOnDestroy;
            }
            if (maps.ngOnChanges) {
                this.$onChanges = maps.ngOnChanges;
            }
            if (maps.ngDoCheck) {
                this.$doCheck = maps.ngDoCheck;
            }
            generator.StylesLoad();
        }
    }
    generator.Class(ComponentClass);
    return generator;
}

function createInjects(target: IComponentClass) {
    return parseInjectsAndDI(target, Reflect.getMetadata(ParamsTypeMetaKey, target) || []);
}

export function parseLifeCycleHooks(proto: any) {
    const maps: { [name: string]: (...params: any[]) => void } = {};
    Object.getOwnPropertyNames(proto).forEach(name => {
        const propery = proto[name];
        if (name === "ngOnInit" || name === "ngOnDestroy" || name === "ngOnChanges" || name === "ngDoCheck") {
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

