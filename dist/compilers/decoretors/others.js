"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var uuid = require("uuid/v4");
var common_1 = require("./../../metadata/common");
exports.InputMetaKey = Symbol("ngx-metadata:Input");
exports.OutputMetaKey = Symbol("ngx-metadata:Output");
exports.OnMetaKey = Symbol("ngx-metadata:On");
exports.WatchMetaKey = Symbol("ngx-metadata:Watch");
exports.ModuleConfigMetaKey = Symbol("ngx-metadata:ModuleConfig");
exports.ModuleRunMetaKey = Symbol("ngx-metadata:ModuleRun");
exports.RequireMetaKey = Symbol("ngx-metadata:DirectiveRequire");
exports.TempRefMetaKey = Symbol("ngx-metadata:TemplateRef");
exports.ParamsTypeMetaKey = "design:paramtypes";
function Require(requireName, scope, strict) {
    if (scope === void 0) { scope = common_1.RequireScope.InnerParent; }
    if (strict === void 0) { strict = false; }
    var tScope;
    if (!scope) {
        tScope = common_1.RequireScope.Current;
    }
    else {
        tScope = scope === "^" ? common_1.RequireScope.InnerParent : scope === "^^" ? common_1.RequireScope.Parent : common_1.RequireScope.Current;
    }
    var tStrict;
    if (typeof (strict) === "string") {
        tStrict = strict === "?" ? common_1.RequireStrict.Unstrict : common_1.RequireStrict.Strict;
    }
    else {
        tStrict = !strict ? common_1.RequireStrict.Unstrict : common_1.RequireStrict.Strict;
    }
    return function requireDecorator(target, propertyKey) {
        var values = Reflect.getMetadata(exports.RequireMetaKey, target) || [];
        values.push({ strict: tStrict, require: requireName, keyName: propertyKey || uuid(), scope: tScope });
        Reflect.defineMetadata(exports.RequireMetaKey, values, target);
    };
}
exports.Require = Require;
function ViewChild(tempName) {
    return function tempRefDecorator(target, propertyKey) {
        var values = Reflect.getMetadata(exports.TempRefMetaKey, target) || [];
        values.push({ keyName: propertyKey, tempName: tempName || propertyKey });
        Reflect.defineMetadata(exports.TempRefMetaKey, values, target);
    };
}
exports.ViewChild = ViewChild;
function Input(aliasOrIsString, twoWay) {
    if (aliasOrIsString === void 0) { aliasOrIsString = false; }
    if (twoWay === void 0) { twoWay = false; }
    var alias;
    var isString = false;
    var isTwoway = false;
    if (typeof (aliasOrIsString) === "string") {
        alias = aliasOrIsString;
        isString = twoWay === null || twoWay === common_1.InputType.String;
        isTwoway = twoWay === true || twoWay === common_1.InputType.TwoWay;
    }
    else {
        isString = aliasOrIsString === true;
        isTwoway = false;
    }
    return function inputDecorator(target, propertyKey) {
        var values = Reflect.getMetadata(exports.InputMetaKey, target) || [];
        values.push({ isString: isString, keyName: propertyKey || uuid(), outAlias: alias, isTwoWay: isTwoway });
        Reflect.defineMetadata(exports.InputMetaKey, values, target);
    };
}
exports.Input = Input;
function Output(config) {
    return function outputDecorator(target, propertyKey) {
        var values = Reflect.getMetadata(exports.OutputMetaKey, target) || [];
        values.push(propertyKey || uuid());
        Reflect.defineMetadata(exports.OutputMetaKey, values, target);
    };
}
exports.Output = Output;
function On(key) {
    return function onEventDecorator(target, propertyKey) {
        var values = Reflect.getMetadata(exports.OnMetaKey, target) || [];
        values.push({ eventKey: key, FuncName: propertyKey || uuid() });
        Reflect.defineMetadata(exports.OnMetaKey, values, target);
    };
}
exports.On = On;
function Watch(key) {
    return function watchDecorator(target, propertyKey) {
        var values = Reflect.getMetadata(exports.WatchMetaKey, target) || [];
        values.push({ watchKey: key, FuncName: propertyKey || uuid() });
        Reflect.defineMetadata(exports.WatchMetaKey, values, target);
    };
}
exports.Watch = Watch;
function Config() {
    var depts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        depts[_i] = arguments[_i];
    }
    return function mdConfigDecorator(target, propertyKey) {
        var values = Reflect.getMetadata(exports.ModuleConfigMetaKey, target) || [];
        values.push({ depts: depts, FuncName: propertyKey || uuid() });
        Reflect.defineMetadata(exports.ModuleConfigMetaKey, values, target);
    };
}
exports.Config = Config;
function Run() {
    var depts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        depts[_i] = arguments[_i];
    }
    return function mdRunDecorator(target, propertyKey) {
        var values = Reflect.getMetadata(exports.ModuleRunMetaKey, target) || [];
        values.push({ depts: depts, FuncName: propertyKey || uuid() });
        Reflect.defineMetadata(exports.ModuleRunMetaKey, values, target);
    };
}
exports.Run = Run;
function Property(propName, readonly, enumerable) {
    if (readonly === void 0) { readonly = false; }
    if (enumerable === void 0) { enumerable = true; }
    return function propertyDecoretor(target, key) {
        Object.defineProperty(target, key, {
            get: function () { return target["" + (propName || "__ngx_" + key)]; },
            set: readonly ? undefined : function (value) { target["" + (propName || "__ngx_" + key)] = value; },
            enumerable: enumerable
        });
    };
}
exports.Property = Property;
function Enumerable() {
    return function enumerableDecoretor(target, key, descriptor) {
        descriptor.enumerable = true;
        return descriptor;
    };
}
exports.Enumerable = Enumerable;
//# sourceMappingURL=others.js.map