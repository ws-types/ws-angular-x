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
var decoretors_1 = require("./../../compilers/decoretors");
var elementRef_1 = require("./elementRef");
var compile_service_1 = require("./../services/compile.service");
var ngxContentPrefix = "__ngxContent_";
var NgTemplateOutletDirective = /** @class */ (function () {
    function NgTemplateOutletDirective($element, $attrs, compile) {
        this.$element = $element;
        this.$attrs = $attrs;
        this.compile = compile;
    }
    NgTemplateOutletDirective.prototype.ngOnInit = function () {
    };
    NgTemplateOutletDirective.prototype.ngOnChanges = function (changes) {
        var _loop_1 = function (key) {
            if (key === "ngTemplateOutlet") {
                if (!this_1.ngTemplateOutlet) {
                    return { value: void 0 };
                }
                this_1.$element.html("");
                var view = this_1.ngTemplateOutlet.createView();
                this_1.$element[0].appendChild(view);
                var context_1 = this_1.ngTemplateOutlet.createContext();
                if (this_1.ngTemplateOutletContext) {
                    var newContent = createNgxContent(this_1.ngTemplateOutletContext);
                    angular.extend(context_1, newContent);
                }
                var attrs = createAttrsList(view.attributes);
                attrs.filter(function (_a) {
                    var name = _a[0], value = _a[1];
                    return name.includes("let-");
                }).forEach(function (_a) {
                    var name = _a[0], value = _a[1];
                    context_1[value] = context_1[ngxContentPrefix + name.replace("let-", "")];
                });
                this_1.compile.link(this_1.$element[0].firstChild, context_1);
            }
        };
        var this_1 = this;
        for (var key in changes) {
            var state_1 = _loop_1(key);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    __decorate([
        decoretors_1.Input(),
        __metadata("design:type", elementRef_1.ElementRef)
    ], NgTemplateOutletDirective.prototype, "ngTemplateOutlet", void 0);
    __decorate([
        decoretors_1.Input(),
        __metadata("design:type", Object)
    ], NgTemplateOutletDirective.prototype, "ngTemplateOutletContext", void 0);
    NgTemplateOutletDirective = __decorate([
        decoretors_1.Directive({
            selector: "ng-template-outlet",
            restrict: "A",
            alias: "__ngxTemplateOutletCtrl"
        }),
        __metadata("design:paramtypes", [Object, Object, compile_service_1.CompileService])
    ], NgTemplateOutletDirective);
    return NgTemplateOutletDirective;
}());
exports.NgTemplateOutletDirective = NgTemplateOutletDirective;
function createAttrsMap(attrs) {
    var maps = {};
    Object.keys(attrs).forEach(function (key) {
        var attr = attrs[key];
        maps[attr.localName] = attr.value;
    });
    return maps;
}
function createAttrsList(attrs) {
    var arr = [];
    Object.keys(attrs).forEach(function (key) {
        var attr = attrs[key];
        arr.push([attr.localName, attr.value]);
    });
    return arr;
}
function createNgxContent(scope) {
    var content = {};
    Object.keys(scope).forEach(function (key) {
        content[ngxContentPrefix + key] = scope[key];
    });
    return content;
}
//# sourceMappingURL=ng-template.directive.js.map