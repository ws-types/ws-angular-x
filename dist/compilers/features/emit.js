"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = (function () {
    function EventEmitter(event) {
        this.event = event;
    }
    EventEmitter.prototype.emit = function (value) {
        this.event({ $event: value });
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=emit.js.map