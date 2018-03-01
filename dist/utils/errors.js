"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorPrefix = "# AngularX #";
function DeclarationExistError(selector) {
    return new SyntaxError("\n    " + errorPrefix + " : the declaration of target is exist, you can't include an exist element twice.\n        " + (selector ? "the selector of target is " + selector : "") + "\n    ");
}
exports.DeclarationExistError = DeclarationExistError;
function ElementTypeError(element, type) {
    return new TypeError("\n    " + errorPrefix + " : the element's type is invalid, you can't include the error type " + (type ? "( need [ " + type + " ] )" : "") + " instance in bundle.\n        " + (element ? "the details of element is : " + JSON.stringify(element) : ""));
}
exports.ElementTypeError = ElementTypeError;
function ModuleDuplicatedError(selector) {
    return new SyntaxError("\n    " + errorPrefix + " : the module's selector is duplicated, you can't create or include the a module with same name in bundle.\n        " + (selector ? "the selector of module is : " + selector : ""));
}
exports.ModuleDuplicatedError = ModuleDuplicatedError;
function ElementDuplicatedError(selector) {
    return new SyntaxError("\n    " + errorPrefix + " : the element's selector is duplicated, you can't create or include the an element with same name in one module.\n        " + (selector ? "the selector of element is : " + selector : ""));
}
exports.ElementDuplicatedError = ElementDuplicatedError;
function ModuleConfigMissedError() {
    return new ReferenceError("\n    " + errorPrefix + " : the module's creation config must be provided.");
}
exports.ModuleConfigMissedError = ModuleConfigMissedError;
function DirectiveConfigMissedError() {
    return new ReferenceError("\n    " + errorPrefix + " : the directive or component's pre-creating config must be provided.");
}
exports.DirectiveConfigMissedError = DirectiveConfigMissedError;
function UnisolateScopeBindingError() {
    return new SyntaxError("\n    " + errorPrefix + " : the directive's scope is not isolate, you can't bind any element into it.");
}
exports.UnisolateScopeBindingError = UnisolateScopeBindingError;
function OldModuleActionsError() {
    return new SyntaxError("\n    " + errorPrefix + " : the old module can't be edit, any action is forbidden.");
}
exports.OldModuleActionsError = OldModuleActionsError;
function RouterRootDuplicatedError() {
    return new SyntaxError("\n    " + errorPrefix + " : the root config of router module is duplicated.");
}
exports.RouterRootDuplicatedError = RouterRootDuplicatedError;
function RoutersConfigUndefinedError() {
    return new SyntaxError("\n    " + errorPrefix + " : the routes config is empty.");
}
exports.RoutersConfigUndefinedError = RoutersConfigUndefinedError;
function RoutersDefaultHomeUndefinedError() {
    return new SyntaxError("\n    " + errorPrefix + " : the routes' default home page url is not defined, or your default route config is wrong, please check..");
}
exports.RoutersDefaultHomeUndefinedError = RoutersDefaultHomeUndefinedError;
function SubRoutesNoPathError() {
    return new SyntaxError("\n    " + errorPrefix + " : the sub route is set wthout a path and state, it's meaningless, please check.");
}
exports.SubRoutesNoPathError = SubRoutesNoPathError;
function OtherwiseRoutesDefineError() {
    return new SyntaxError("\n    " + errorPrefix + " : the otherwise route is messing or badly defined, please check.");
}
exports.OtherwiseRoutesDefineError = OtherwiseRoutesDefineError;
function InjectionKeyDepulicateError(key) {
    return new Error("\n    " + errorPrefix + " : the key of element to be injected is duplicated, please check.\n        " + (key ? "the key of element is : " + key : ""));
}
exports.InjectionKeyDepulicateError = InjectionKeyDepulicateError;
exports.errors = {
    DeclarationExist: DeclarationExistError,
    ElementType: ElementTypeError,
    ModuleDuplicated: ModuleDuplicatedError,
    ElementDuplicated: ElementDuplicatedError,
    ModuleConfigMissing: ModuleConfigMissedError,
    DirectiveConfigMissed: DirectiveConfigMissedError,
    UnisolateScopeBinding: UnisolateScopeBindingError,
    OldModuleActions: OldModuleActionsError,
    RouterRootDuplicated: RouterRootDuplicatedError,
    RoutersConfigUndefined: RoutersConfigUndefinedError,
    RoutersDefaultHomeUndefined: RoutersDefaultHomeUndefinedError,
    SubRoutesNoPath: SubRoutesNoPathError,
    OtherwiseRoutesDefine: OtherwiseRoutesDefineError,
    InjectionKeyDepulicate: InjectionKeyDepulicateError,
};
//# sourceMappingURL=errors.js.map