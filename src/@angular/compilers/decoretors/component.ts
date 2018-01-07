import "reflect-metadata";
import { IComponentConfig, IComponentClass } from "./../../metadata";
import { CreateComponent } from "./../creators";
import { InputMetaKey, OutputMetaKey, IInputProperty, ParamsTypeMetaKey } from "./others";
import { ComponentGenerator } from "./../generators";
import { EventEmitter } from "./../features/emit";
import { parseInjectsAndDI } from "./provider";
import { bindPolyfill } from "./../../utils/bind.polyfill";

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
    const outputs = parseIOProperties(target.prototype, generator);
    const injects = createInjects(target);
    bindPolyfill();
    class ComponentClass extends target {
        public static $inject = injects;
        constructor(...args: any[]) {
            super(...args);
            generator.StylesLoad();
            target.prototype.$onInit = () => {
                outputs.forEach(emit => this[emit] = new EventEmitter<any>(this[emit]));
                if (target.prototype.ngOnInit) {
                    target.prototype.ngOnInit.bind(this)();
                }
            };
        }
    }
    if (target.prototype.ngOnDestroy) {
        target.prototype.$onDestroy = target.prototype.ngOnDestroy;
    }
    if (target.prototype.ngAfterViewInit) {
        target.prototype.$postLink = target.prototype.ngAfterViewInit;
    }
    if (target.prototype.ngChanges) {
        target.prototype.$onChanges = target.prototype.ngChanges;
    }
    if (target.prototype.ngDoCheck) {
        target.prototype.$doCheck = target.prototype.ngDoCheck;
    }
    generator.Class(ComponentClass);
    return generator;
}

function createInjects(target: IComponentClass) {
    return parseInjectsAndDI(target, Reflect.getMetadata(ParamsTypeMetaKey, target) || []);
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

