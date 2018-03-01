"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v4");
var metadata_1 = require("./../../metadata");
var selector_parser_1 = require("../parsers/selector-parser");
var ProviderGenerator = /** @class */ (function () {
    function ProviderGenerator(config) {
        this.config = config;
        if (config.name) {
            this._selector = config.name;
        }
        else if (!config.selector) {
            this._selector = selector_parser_1.SelectorParse("service-" + uuid());
        }
        else {
            this._selector = selector_parser_1.SelectorParse(config.selector);
        }
    }
    Object.defineProperty(ProviderGenerator.prototype, "Selector", {
        get: function () { return this._selector; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProviderGenerator.prototype, "Type", {
        get: function () { return metadata_1.GeneratorType.Provider; },
        enumerable: true,
        configurable: true
    });
    ProviderGenerator.prototype.Class = function (ctrl) {
        this._ctrl = ctrl;
        return this;
    };
    ProviderGenerator.prototype.Build = function () {
        return this._ctrl;
    };
    return ProviderGenerator;
}());
exports.ProviderGenerator = ProviderGenerator;
//# sourceMappingURL=provider.js.map