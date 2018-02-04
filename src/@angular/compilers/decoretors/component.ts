import "reflect-metadata";
import * as angular from "angular";
import { IComponentConfig, IComponentClass } from "./../../metadata";
import { CreateComponent } from "./../creators";
import {
    InputMetaKey, OutputMetaKey, IInputProperty,
    IRequireProperty, RequireMetaKey, ParamsTypeMetaKey,
    TempRefMetaKey, ITemplateRefProperty
} from "./others";
import { ComponentGenerator } from "./../generators";
import { EventEmitter } from "./../features/emit";
import { parseInjectsAndDI } from "./provider";
import { bindPolyfill } from "./../../utils/bind.polyfill";
import {
    createInjects, mixinScope, mixinClass,
    mixinClassProto, mixinDomScope, ngHostSet,
    ngTempRefSet
} from "./directive";
import { TemplateRef } from "./../../core/template/templateRef";
import { NgHostPrefix } from "./../parsers/template-parser";

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
    const selector = config.selector;
    const generator = CreateComponent(config);
    const outputs = parseIOProperties(target.prototype, generator);
    const { injects, scopeIndex, elementIndex, attrsIndex } = createInjects(target, config.mixin, true, true);
    bindPolyfill();
    const proto = target.prototype;
    class ComponentClass extends target {

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
            ngTempRefSet(this, generator.ViewChildren, ngHostSet(this, selector, true));
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
            switch (key) {
                case InputMetaKey:
                    const input = prop as IInputProperty;
                    generator.Input(input.keyName, input.outAlias, input.isString, input.isTwoWay);
                    break;
                case OutputMetaKey:
                    generator.Output(prop);
                    outputs.push(prop);
                    break;
                case RequireMetaKey:
                    const require = prop as IRequireProperty;
                    generator.Require(require.require, require.keyName, require.scope, require.strict);
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

