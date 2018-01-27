import { IDirectiveConfig, IDirectiveClass, Type } from "./../../metadata";
import { CreateDirective } from "./../creators";
import { DirectiveGenerator } from "./../generators";
import {
    OutputMetaKey, IInputProperty, InputMetaKey,
    OnMetaKey, IOnProperty, WatchMetaKey, IRequireProperty,
    RequireMetaKey, IWatchProperty, ParamsTypeMetaKey
} from "./others";
import { EventEmitter } from "./../features/emit";
import { parseInjectsAndDI } from "./provider";
import { bindPolyfill } from "./../../utils/bind.polyfill";


export function Directive(config: IDirectiveConfig) {
    return function direcDecorator<T extends IDirectiveClass>(target: T) {
        const generator = createExtends(config, target);
        target.generator = generator;
    };
}

export function $Directive(config: IDirectiveConfig) {
    return {
        Decorate: <T extends IDirectiveClass>(target: T): T => {
            const generator = createExtends(config, target);
            target.generator = generator;
            return target;
        }
    };
}

function createExtends<T extends IDirectiveClass>(config: IDirectiveConfig, target: T) {
    const generator = CreateDirective(config);
    const outputs = parseIOProperties(target.prototype, generator);
    const [injects, scopeIndex] = createInjects(target, config.mixin);
    bindPolyfill();
    const proto = target.prototype;
    class DirectiveClass extends target {

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
    generator.Class(DirectiveClass);
    return generator;
}


export function mixinScope(instance: any, scope: ng.IScope) {
    instance["$scope"] = scope;
}

export function mixinClass(scope: ng.IScope, instance: any) {
    Object.keys(instance).filter(i => !i.includes("$")).forEach(key => {
        Object.defineProperty(scope, key, {
            get: () => instance[key],
            enumerable: false
        });
    });
}

export function mixinClassProto(scope: ng.IScope, target: any, instance: any) {
    Object.keys(target.prototype).forEach(key => {
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
        if (descriptor.get) {
            Object.defineProperty(scope, key, {
                get: descriptor.get,
                set: descriptor.set,
                enumerable: false
            });
        } else if (descriptor.value) {
            if (typeof (descriptor.value) === "function") {
                scope[key] = (...args: any[]) => descriptor.value.bind(instance)(...args);
            } else {
                scope[key] = descriptor.value;
            }
        }
    });
}


export function createInjects(target: any, isMixin = false): [string[], number] {
    const injects = parseInjectsAndDI(target, Reflect.getMetadata(ParamsTypeMetaKey, target) || []);
    if (isMixin) {
        if (!injects.includes("$scope")) {
            injects.unshift("$scope");
            return [injects, 0];
        } else {
            return [injects, injects.findIndex(i => i === "$scope")];
        }
    } else {
        return [injects, -1];
    }
}

function parseIOProperties(proto: any, generator: DirectiveGenerator) {
    const outputs: string[] = [];
    const IOKeys = Reflect.getMetadataKeys(proto);
    IOKeys.forEach(key => {
        (Reflect.getMetadata(key, proto) as any[]).forEach(prop => {
            switch (key) {
                case RequireMetaKey:
                    const require = prop as IRequireProperty;
                    generator.Require(require.require, require.keyName, require.isStrict);
                    break;
                case InputMetaKey:
                    const input = prop as IInputProperty;
                    generator.Input(input.keyName, input.outAlias, input.isString, input.isTwoWay);
                    break;
                case OutputMetaKey:
                    generator.Output(prop);
                    outputs.push(prop);
                    break;
                case OnMetaKey:
                    const on = prop as IOnProperty;
                    generator.On(on.eventKey, proto[on.FuncName]);
                    break;
                case WatchMetaKey:
                    const watch = prop as IWatchProperty;
                    generator.Watch(watch.watchKey, proto[watch.FuncName]);
                    break;
            }
        });
    });
    return outputs;
}
