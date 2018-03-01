"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ElementRef = /** @class */ (function () {
    function ElementRef(nativeElement, scope) {
        this.nativeElement = nativeElement;
        this.scope = scope;
    }
    ElementRef.prototype.setContext = function (_scope) {
        this.scope = _scope;
        return this;
    };
    ElementRef.prototype.createView = function () {
        return this.nativeElement.cloneNode(true);
    };
    ElementRef.prototype.createContext = function () {
        return this.scope && this.scope.$new(false, this.scope);
    };
    return ElementRef;
}());
exports.ElementRef = ElementRef;
//# sourceMappingURL=elementRef.js.map