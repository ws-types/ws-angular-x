"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v4");
var metadata_1 = require("./../../metadata");
var selector_parser_1 = require("./../../compilers/parsers/selector-parser");
var PipeGenerator = /** @class */ (function () {
    function PipeGenerator(config) {
        this.config = config;
        if (config.name) {
            this._selector = config.name;
        }
        else {
            this._selector = selector_parser_1.SelectorParse("pipe-" + uuid());
        }
    }
    Object.defineProperty(PipeGenerator.prototype, "Selector", {
        get: function () { return this._selector; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PipeGenerator.prototype, "Type", {
        get: function () { return metadata_1.GeneratorType.Pipe; },
        enumerable: true,
        configurable: true
    });
    PipeGenerator.prototype.Class = function (ctrl) {
        this._ctrl = ctrl;
        return this;
    };
    PipeGenerator.prototype.Build = function () {
        var _this = this;
        return function () { return _this._ctrl.prototype.transform; };
    };
    return PipeGenerator;
}());
exports.PipeGenerator = PipeGenerator;
//# sourceMappingURL=pipe.js.map