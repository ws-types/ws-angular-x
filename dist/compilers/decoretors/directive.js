"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var creators_1 = require("./../creators");
var others_1 = require("./others");
var emit_1 = require("./../features/emit");
var provider_1 = require("./provider");
var bind_polyfill_1 = require("./../../utils/bind.polyfill");
var template_parser_1 = require("./../parsers/template-parser");
var config_1 = require("./../../i18n/config");
function Directive(config) {
    return function direcDecorator(target) {
        var generator = createExtends(config, target);
        target.generator = generator;
    };
}
exports.Directive = Directive;
function $Directive(config) {
    return {
        Decorate: function (target) {
            var generator = createExtends(config, target);
            target.generator = generator;
            return target;
        }
    };
}
exports.$Directive = $Directive;
function createExtends(config, target) {
    var selector = config.selector;
    var hasTemplate = !!config.template;
    var generator = creators_1.CreateDirective(config);
    var outputs = parseIOProperties(target.prototype, generator);
    var _a = createInjects(target), injects = _a.injects, scopeIndex = _a.scopeIndex, elementIndex = _a.elementIndex, attrsIndex = _a.attrsIndex, i18nIndex = _a.i18nIndex;
    bind_polyfill_1.bindPolyfill();
    var proto = target.prototype;
    var DirectiveClass = /** @class */ (function (_super) {
        __extends(DirectiveClass, _super);
        function DirectiveClass() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            generator.StylesLoad();
            provider_1.buildI18nData(_this, args[i18nIndex], config.i18n);
            mixinDomScope(_this, args[elementIndex], args[attrsIndex]);
            mixinScope(_this, args[scopeIndex]);
            return _this;
        }
        DirectiveClass.prototype.$onInit = function () {
            var _this = this;
            outputs.forEach(function (emit) { return _this[emit] = new emit_1.EventEmitter(_this[emit]); });
            ngTempRefSet(this, generator.ViewChildren);
            if (config.mixin && this["$scope"]) {
                mixinClass(this["$scope"], this);
                mixinClassProto(this["$scope"], target, this);
            }
            if (proto.ngOnInit) {
                proto.ngOnInit.bind(this)();
            }
        };
        DirectiveClass.prototype.$onDestroy = function () {
            generator.StylesUnload();
            if (proto.ngOnDestroy) {
                proto.ngOnDestroy.bind(this)();
            }
        };
        DirectiveClass.prototype.$postLink = function () {
            ngHostSet(this, selector, hasTemplate);
            if (proto.ngAfterViewInit) {
                proto.ngAfterViewInit.bind(this)();
            }
        };
        DirectiveClass.prototype.$onChanges = function (changes) {
            if (proto.ngOnChanges) {
                proto.ngOnChanges.bind(this)(changes);
            }
        };
        DirectiveClass.prototype.$doCheck = function () {
            if (proto.ngDoCheck) {
                proto.ngDoCheck.bind(this)();
            }
        };
        DirectiveClass.$inject = injects;
        return DirectiveClass;
    }(target));
    generator.Class(DirectiveClass);
    return generator;
}
function ngHostSet(instance, selector, addHost) {
    if (addHost === void 0) { addHost = false; }
    var root = instance["$element"];
    if (addHost) {
        root.attr(template_parser_1.NgHostPrefix + "-" + selector, "");
    }
    return root;
}
exports.ngHostSet = ngHostSet;
function ngTempRefSet(instance, children) {
    if (children.length > 0) {
        children.forEach(function (_a) {
            var key = _a[0], element = _a[1];
            return instance[key] = element.setContext(instance["$scope"]);
        });
    }
}
exports.ngTempRefSet = ngTempRefSet;
function mixinScope(instance, scope) {
    instance["$scope"] = scope;
    try {
        Object.defineProperty(scope, "i18n", {
            get: function () { return instance["i18n"]; },
            enumerable: false
        });
    }
    catch (e) {
        /* ignore redefin*/
    }
}
exports.mixinScope = mixinScope;
function mixinDomScope(instance, $element, $attrs) {
    if ($element) {
        instance["$element"] = $element;
    }
    if ($attrs) {
        instance["$attrs"] = $attrs;
    }
}
exports.mixinDomScope = mixinDomScope;
function mixinClass(scope, instance) {
    Object.keys(instance).filter(function (i) { return !i.includes("$"); }).forEach(function (key) {
        try {
            Object.defineProperty(scope, key, {
                get: function () { return instance[key]; },
                set: function (value) { return instance[key] = value; },
                enumerable: false
            });
        }
        catch (e) {
            /* ignore redefin*/
        }
    });
}
exports.mixinClass = mixinClass;
function mixinClassProto(scope, target, instance) {
    Object.getOwnPropertyNames(target.prototype).forEach(function (key) {
        var descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
        if (descriptor.get) {
            try {
                Object.defineProperty(scope, key, {
                    get: descriptor.get.bind(instance),
                    set: descriptor.set && descriptor.set.bind(instance),
                    enumerable: false
                });
            }
            catch (e) {
                /* ignore redefin*/
            }
        }
        else if (descriptor.value && key !== "constructor") {
            if (typeof (descriptor.value) === "function") {
                scope[key] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return descriptor.value.bind(instance).apply(void 0, args);
                };
            }
            else {
                scope[key] = descriptor.value;
            }
        }
    });
}
exports.mixinClassProto = mixinClassProto;
function createInjects(target, need$Scope, need$Element, need$Attrs, need$i18n) {
    if (need$Scope === void 0) { need$Scope = true; }
    if (need$Element === void 0) { need$Element = true; }
    if (need$Attrs === void 0) { need$Attrs = true; }
    if (need$i18n === void 0) { need$i18n = true; }
    var result = {
        injects: provider_1.parseInjectsAndDI(target, Reflect.getMetadata(others_1.ParamsTypeMetaKey, target) || []),
        scopeIndex: -1,
        elementIndex: -1,
        attrsIndex: -1,
        i18nIndex: -1
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
    if (need$i18n) {
        result.i18nIndex = add$Inject(result, config_1.I18N_SELECTOR);
    }
    return result;
}
exports.createInjects = createInjects;
function add$Inject(result, target) {
    if (!result.injects.includes(target)) {
        result.injects.push(target);
        return result.injects.length - 1;
    }
    else {
        return result.injects.findIndex(function (i) { return i === target; });
    }
}
function parseIOProperties(proto, generator) {
    var outputs = [];
    var IOKeys = Reflect.getMetadataKeys(proto);
    IOKeys.forEach(function (key) {
        Reflect.getMetadata(key, proto).forEach(function (prop) {
            switch (key) {
                case others_1.RequireMetaKey:
                    var require_1 = prop;
                    generator.Require(require_1.require, require_1.keyName, require_1.scope, require_1.strict);
                    break;
                case others_1.InputMetaKey:
                    var input = prop;
                    generator.Input(input.keyName, input.outAlias, input.isString, input.isTwoWay);
                    break;
                case others_1.OutputMetaKey:
                    generator.Output(prop);
                    outputs.push(prop);
                    break;
                case others_1.OnMetaKey:
                    var on = prop;
                    generator.On(on.eventKey, proto[on.FuncName]);
                    break;
                case others_1.WatchMetaKey:
                    var watch = prop;
                    generator.Watch(watch.watchKey, proto[watch.FuncName]);
                    break;
                case others_1.TempRefMetaKey:
                    var tempRef = prop;
                    generator.ViewChild(tempRef.tempName, tempRef.keyName);
                    break;
            }
        });
    });
    return outputs;
}
//# sourceMappingURL=directive.js.map