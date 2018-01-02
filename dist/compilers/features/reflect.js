"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var ReflectContainer = (function () {
    function ReflectContainer() {
        this._providers = {};
    }
    Object.defineProperty(ReflectContainer.prototype, "Providers", {
        get: function () { return this._providers; },
        enumerable: true,
        configurable: true
    });
    ReflectContainer.prototype.Register = function (key, value) {
        this._providers[key] = value;
    };
    ReflectContainer.prototype.GetKey = function (value) {
        var _this = this;
        var tuples = Object.keys(this._providers).map(function (key) { return [key, _this._providers[key]]; });
        return (tuples.find(function (_a) {
            var k = _a[0], v = _a[1];
            return value === v;
        }) || [null, value])[0];
    };
    ReflectContainer.prototype.GetValue = function (key) {
        return this._providers[key] || null;
    };
    ReflectContainer.prototype.GetArguments = function (func) {
        return getParameterNames(func);
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
var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var DEFAULT_PARAMS = /=[^,]+/mg;
var FAT_ARROWS = /=>.*$/mg;
function getParameterNames(fn) {
    var code = fn.toString()
        .replace(COMMENTS, "")
        .replace(FAT_ARROWS, "")
        .replace(DEFAULT_PARAMS, "");
    var result = code.slice(code.indexOf("(") + 1, code.indexOf(")"))
        .match(/([^\s,]+)/g);
    return result === null ? [] : result;
}
//# sourceMappingURL=reflect.js.map