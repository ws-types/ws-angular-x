import * as angular from "angular";
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
import { NgHostPrefix } from "./../parsers/template-parser";

export interface IInjectBundle {
    injects: string[];
    scopeIndex?: number;
    elementIndex?: number;
    attrsIndex?: number;
}

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
    const selector = config.selector;
    const hasTemplate = !!config.template;
    const generator = CreateDirective(config);
    const outputs = parseIOProperties(target.prototype, generator);
    const { injects, scopeIndex, elementIndex, attrsIndex } = createInjects(target, config.mixin, true, true);
    bindPolyfill();
    const proto = target.prototype;
    class DirectiveClass extends target {

        public static $inject = injects;

        constructor(...args: any[]) {
            super(...args);
            generator.StylesLoad();
            mixinDomScope(this, args[elementIndex], args[attrsIndex]);
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
            ngTempRefSet(this, generator.ViewChildren, ngHostSet(this, selector, hasTemplate));
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

export function ngHostSet(instance: any, selector: string, addHost = false) {
    const root = instance["$element"] as ng.IRootElementService;
    if (addHost) {
        root.attr(`${NgHostPrefix}-${selector}`, "");
    }
    return root;
}

export function ngTempRefSet(instance: any, children: Array<[string, string]>, root: angular.IRootElementService) {
    if (children.length > 0) {
        children.forEach(([key, name]) => {
            const temp = root.find(`[ngx-name-selector="${name}"]`)[0];
            if (temp) {
                temp.parentElement.removeChild(temp);
            }
            instance[key] = new TemplateRef<any>(temp);
        });
    }
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
    const result: IInjectBundle = {
        injects: parseInjectsAndDI(target, Reflect.getMetadata(ParamsTypeMetaKey, target) || []),
        scopeIndex: -1,
        elementIndex: -1,
        attrsIndex: -1
    };
    if (need$Scope) {
        result.scopeIndex = add$Inject(result, "$scope");
    }
    if (need$Element) {
        result.elementIndex = add$Inject(result, "$element");
    }
    if (need$Attrs) {
        result.attrsIndex = add$Inject(result, "$attrs");
    }
    return result;
}

function add$Inject(result: IInjectBundle, target: string) {
    if (!result.injects.includes(target)) {
        result.injects.push(target);
        return result.injects.length - 1;
    } else {
        return result.injects.findIndex(i => i === target);
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
