import { IDirectiveConfig, IDirectiveClass, Type } from "./../../metadata";
import { CreateDirective } from "./../creators";
import { DirectiveGenerator } from "./../generators";
import {
    OutputMetaKey, IInputProperty, InputMetaKey,
    OnMetaKey, IOnProperty, WatchMetaKey, IWatchProperty, ParamsTypeMetaKey
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
    const injects = createInjects(target);
    bindPolyfill();
    setTimeout(() => console.log(JSON.stringify(target)));
    class DirectiveClass extends target {
        public static $inject = injects;
        constructor(...args: any[]) {
            super(...args);
            generator.StylesLoad();
            console.log(this);
            target.prototype.$onInit = () => {
                outputs.forEach(emit => this[emit] = new EventEmitter<any>(this[emit]));
                if (target.prototype.ngOnInit) {
                    target.prototype.ngOnInit.bind(this)();
                }
            };
        }
    }
    target.prototype.$onDestroy = target.prototype.ngOnDestroy;
    target.prototype.$postLink = target.prototype.ngAfterViewInit;
    target.prototype.$onChanges = target.prototype.ngChanges;
    target.prototype.$doCheck = target.prototype.ngDoCheck;
    generator.Class(DirectiveClass);
    return generator;
}

function createInjects(target: IDirectiveClass) {
    return parseInjectsAndDI(target, Reflect.getMetadata(ParamsTypeMetaKey, target) || []);
}

function parseIOProperties(proto: any, generator: DirectiveGenerator) {
    const outputs: string[] = [];
    const IOKeys = Reflect.getMetadataKeys(proto);
    IOKeys.forEach(key => {
        (Reflect.getMetadata(key, proto) as any[]).forEach(prop => {
            switch (key) {
                case InputMetaKey:
                    const input = prop as IInputProperty;
                    generator.Input(input.keyName, !input.isString);
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
