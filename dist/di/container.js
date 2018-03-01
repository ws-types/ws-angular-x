"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var class_metadata_parser_1 = require("./class-metadata-parser");
var errors_1 = require("./../utils/errors");
var ReflectContainer = /** @class */ (function () {
    function ReflectContainer() {
        this.__providers = [];
    }
    Object.defineProperty(ReflectContainer.prototype, "Providers", {
        get: function () { return this.__providers; },
        enumerable: true,
        configurable: true
    });
    ReflectContainer.prototype.Register = function (key, value) {
        if (this.__providers.findIndex(function (_a) {
            var k = _a[0], v = _a[1];
            return k === key;
        }) < 0) {
            this.__providers.push([key, value]);
        }
        else {
            throw errors_1.InjectionKeyDepulicateError(key);
        }
    };
    ReflectContainer.prototype.GetKey = function (value) {
        return (this.__providers.find(function (_a) {
            var k = _a[0], v = _a[1];
            return value === v;
        }) || [null, value])[0];
    };
    ReflectContainer.prototype.GetValue = function (key) {
        var ele = this.__providers.find(function (_a) {
            var k = _a[0], v = _a[1];
            return k === key;
        });
        return !ele ? null : (ele[1] || null);
    };
    ReflectContainer.prototype.GetArguments = function (func) {
        return class_metadata_parser_1.ClassMetadataParser.GetES5CtorParamsName(func);
    };
    return ReflectContainer;
}());
exports.ReflectContainer = ReflectContainer;
exports.DI = new ReflectContainer();
function Inject(func) {
    return exports.DI.GetKey(func);
}
exports.Inject = Inject;
function Injects(func_names) {
    return func_names.map(function (fn) { return typeof (fn) === "string" ? fn : exports.DI.GetKey(fn); });
}
exports.Injects = Injects;
//# sourceMappingURL=container.js.map