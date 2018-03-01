"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var creators_1 = require("./../creators");
function Pipe(config) {
    return function decorator(target) {
        var generator = createController(config, target);
        target.generator = generator.Class(target);
    };
}
exports.Pipe = Pipe;
function $Pipe(config) {
    return {
        Decorate: function (target) {
            var generator = createController(config, target);
            target.generator = generator.Class(target);
            return target;
        }
    };
}
exports.$Pipe = $Pipe;
function createController(config, target) {
    var nConfig = typeof (config) === "string" ? { name: config } : config;
    var generator = creators_1.CreatePipe(nConfig);
    if (!target.prototype.transform) {
        target.prototype.transform = function (value) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return value;
        };
    }
    return generator;
}
//# sourceMappingURL=pipe.js.map