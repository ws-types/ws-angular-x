import { IDirectiveConfig, IDirectiveClass, Type } from "./../../metadata";
import { CreateDirective } from "./../creators";
import { DirectiveGenerator } from "./../generators";
import {
    OutputMetaKey, IInputProperty, InputMetaKey,
    OnMetaKey, IOnProperty, WatchMetaKey, IRequireProperty,
    RequireMetaKey, IWatchProperty, ParamsTypeMetaKey,
    TempRefMetaKey, ITemplateRefProperty
} from "./others";
import { EventEmitter } from "./../features/emit";
import { parseInjectsAndDI } from "./provider";
import { bindPolyfill } from "./../../utils/bind.polyfill";
import { TemplateRef } from "./../../core/template/templateRef";


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
    const needDom = generator.ViewChildren.length > 0;
    const { injects, scopeIndex, elementIndex, attrsIndex } = createInjects(target, config.mixin, needDom, needDom);
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
            if (needDom) {
                mixinDomScope(this, args[elementIndex], args[attrsIndex]);
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
            if (generator.ViewChildren.length > 0) {
                const root = this["$element"] as ng.IRootElementService;
                generator.ViewChildren.forEach(([key, name]) => {
                    this[key] = new TemplateRef<any>(root.find(`[ngx-name-selector="${name}"]`)[0]);
                });
            }
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

export function mixinDomScope(instance: any, $element?: ng.IRootElementService, $attrs?: ng.IAttributes) {
    if ($element) {
        instance["$element"] = $element;
    }
    if ($attrs) {
        instance["$attrs"] = $attrs;
    }
}

export function mixinClass(scope: ng.IScope, instance: any) {
    Object.keys(instance).filter(i => !i.includes("$")).forEach(key => {
        Object.defineProperty(scope, key, {
            get: () => instance[key],
            set: (value) => instance[key] = value,
            enumerable: false
        });
    });
}

export function mixinClassProto(scope: ng.IScope, target: any, instance: any) {
    Object.getOwnPropertyNames(target.prototype).forEach(key => {
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
        if (descriptor.get) {
            Object.defineProperty(scope, key, {
                get: descriptor.get.bind(instance),
                set: descriptor.set && descriptor.set.bind(instance),
                enumerable: false
            });
        } else if (descriptor.value && key !== "constructor") {
            if (typeof (descriptor.value) === "function") {
                scope[key] = (...args: any[]) => descriptor.value.bind(instance)(...args);
            } else {
                scope[key] = descriptor.value;
            }
        }
    });
}


export function createInjects(target: any, need$Scope = false, need$Element = false, need$Attrs = false) {
    const result = {
        injects: parseInjectsAndDI(target, Reflect.getMetadata(ParamsTypeMetaKey, target) || []),
        scopeIndex: -1,
        elementIndex: -1,
        attrsIndex: -1
    };
    if (need$Scope) {
        if (!result.injects.includes("$scope")) {
            result.injects.push("$scope");
            result.scopeIndex = result.injects.length - 1;
        } else {
            result.scopeIndex = result.injects.findIndex(i => i === "$scope");
        }
    }
    if (need$Element) {
        if (!result.injects.includes("$element")) {
            result.injects.push("$element");
            result.elementIndex = result.injects.length - 1;
        } else {
            result.elementIndex = result.injects.findIndex(i => i === "$element");
        }
    }
    if (need$Attrs) {
        if (!result.injects.includes("$attrs")) {
            result.injects.push("$attrs");
            result.attrsIndex = result.injects.length - 1;
        } else {
            result.attrsIndex = result.injects.findIndex(i => i === "$attrs");
        }
    }
    return result;
}

function parseIOProperties(proto: any, generator: DirectiveGenerator) {
    const outputs: string[] = [];
    const IOKeys = Reflect.getMetadataKeys(proto);
    IOKeys.forEach(key => {
        (Reflect.getMetadata(key, proto) as any[]).forEach(prop => {
            switch (key) {
                case RequireMetaKey:
                    const require = prop as IRequireProperty;
                    generator.Require(require.require, require.keyName, require.scope, require.strict);
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
                case TempRefMetaKey:
                    const tempRef = prop as ITemplateRefProperty;
                    generator.ViewChild(tempRef.tempName, tempRef.keyName);
                    break;
            }
        });
    });
    return outputs;
}
