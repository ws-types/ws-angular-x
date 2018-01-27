import "reflect-metadata";
import * as angular from "angular";
import { IComponentConfig, IComponentClass } from "./../../metadata";
import { CreateComponent } from "./../creators";
import {
    InputMetaKey, OutputMetaKey, IInputProperty,
    IRequireProperty, RequireMetaKey, ParamsTypeMetaKey
} from "./others";
import { ComponentGenerator } from "./../generators";
import { EventEmitter } from "./../features/emit";
import { parseInjectsAndDI } from "./provider";
import { bindPolyfill } from "./../../utils/bind.polyfill";
import { createInjects, mixinScope, mixinClass, mixinClassProto } from "./directive";

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
    const [injects, scopeIndex] = createInjects(target, config.mixin);
    bindPolyfill();
    const proto = target.prototype;
    class ComponentClass extends target {

        public static $inject = injects;

        constructor(...args: any[]) {
            super(...args);
            generator.StylesLoad();
            if (config.mixin) {
                mixinScope(this, args[scopeIndex]);
            }
        }

        public $onInit() {
            outputs.forEach(emit => this[emit] = new EventEmitter<any>(this[emit]));
            if (config.mixin && this["$scope"]) {
                mixinClass(this["$scope"], this);
                mixinClassProto(this["$scope"], target, this);
            }
            if (proto.ngOnInit) {
                proto.ngOnInit.bind(this)();
            }
        }

        public $onDestroy() {
            generator.StylesUnload();
            if (proto.ngOnDestroy) {
                proto.ngOnDestroy.bind(this)();
            }
        }

        public $postLink() {
            if (proto.ngAfterViewInit) {
                proto.ngAfterViewInit.bind(this)();
            }
        }

        public $onChanges(changes: any) {
            if (proto.ngOnChanges) {
                proto.ngOnChanges.bind(this)(changes);
            }
        }

        public $doCheck() {
            if (proto.ngDoCheck) {
                proto.ngDoCheck.bind(this)();
            }
        }

    }
    generator.Class(ComponentClass);
    return generator;
}

function parseIOProperties(proto: any, generator: ComponentGenerator) {
    const outputs: string[] = [];
    const IOKeys = Reflect.getMetadataKeys(proto);
    IOKeys.forEach(key => {
        (Reflect.getMetadata(key, proto) as any[]).forEach(prop => {
            if (key === InputMetaKey) {
                const input = prop as IInputProperty;
                generator.Input(input.keyName, input.outAlias, input.isString, input.isTwoWay);
            } else if (key === OutputMetaKey) {
                generator.Output(prop);
                outputs.push(prop);
            } else if (key === RequireMetaKey) {
                const require = prop as IRequireProperty;
                generator.Require(require.require, require.keyName, require.isStrict);
            }
        });
    });
    return outputs;
}

