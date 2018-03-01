"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("angular");
var directive_1 = require("../../compilers/decoretors/directive");
var template_parser_1 = require("../../compilers/parsers/template-parser");
var NgxExposeDirective = /** @class */ (function () {
    function NgxExposeDirective($element) {
        this.$element = $element;
    }
    NgxExposeDirective.prototype.ngAfterViewInit = function () {
        var attributes = this.$element[0].attributes;
        var attrs = [];
        Object.keys(attributes).forEach(function (key) { return attrs.push(attributes[key]); });
        var lead = attrs.map(function (i) { return i.localName; }).find(function (i) { return i.includes(template_parser_1.NgContentPrefix); });
        if (lead) {
            parseTemplate(this.$element, lead);
        }
    };
    NgxExposeDirective = __decorate([
        directive_1.Directive({
            selector: "ngx-expose",
            restrict: "A",
            alias: "__ngxExpose",
            isolate: false,
            merge: true,
            transclude: false,
            bindingToController: false,
        }),
        __metadata("design:paramtypes", [Object])
    ], NgxExposeDirective);
    return NgxExposeDirective;
}());
exports.NgxExposeDirective = NgxExposeDirective;
function parseTemplate(ele, selector) {
    angular.forEach(ele.children(), function (element, index) { return parseNode(element, selector); });
}
function parseNode(element, selector) {
    var eleRoot = angular.element(element);
    eleRoot.attr(selector, "");
    angular.forEach(eleRoot.children(), function (ele, index) { return parseNode(ele, selector); });
}
//# sourceMappingURL=ngx-expose.directive.js.map