"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var uuid = require("uuid/v4");
exports.InputMetaKey = Symbol("ng-metadata:Input");
exports.OutputMetaKey = Symbol("ng-metadata:Output");
exports.OnMetaKey = Symbol("ng-metadata:On");
exports.WatchMetaKey = Symbol("ng-metadata:Watch");
exports.ModuleConfigMetaKey = Symbol("ng-metadata:ModuleConfig");
exports.ModuleRunMetaKey = Symbol("ng-metadata:ModuleRun");
exports.ParamsTypeMetaKey = "design:paramtypes";
function Input(isString) {
    if (isString === void 0) { isString = false; }
    return function inputDecorator(target, propertyKey) {
        var values = Reflect.getMetadata(exports.InputMetaKey, target) || [];
        values.push({ isString: isString, keyName: propertyKey || uuid() });
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
//# sourceMappingURL=others.js.map