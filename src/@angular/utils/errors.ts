
const errorPrefix = "# AngularX #";

export function DeclarationExistError(selector?: string) {
    return new SyntaxError(`
    ${errorPrefix} : the declaration of target is exist, you can't include an exist element twice.
        ${selector ? "the selector of target is " + selector : ""}
    `);
}

export function ElementTypeError(element?: any, type?: string) {
    return new TypeError(`
    ${errorPrefix} : the element's type is invalid, you can't include the error type ${type ? "( need [ " + type + " ] )" : ""} instance in bundle.
        ${element ? "the details of element is : " + JSON.stringify(element) : ""}`);
}

export function ModuleDuplicatedError(selector?: string) {
    return new SyntaxError(`
    ${errorPrefix} : the module's selector is duplicated, you can't create or include the a module with same name in bundle.
        ${selector ? "the selector of module is : " + selector : ""}`);
}

export function ElementDuplicatedError(selector?: string) {
    return new SyntaxError(`
    ${errorPrefix} : the element's selector is duplicated, you can't create or include the an element with same name in one module.
        ${selector ? "the selector of element is : " + selector : ""}`);
}

export function ModuleConfigMissedError() {
    return new ReferenceError(`
    ${errorPrefix} : the module's creation config must be provided.`);
}

export function UnisolateScopeBindingError() {
    return new SyntaxError(`
    ${errorPrefix} : the directive's scope is not isolate, you can't bind any element into it.`);
}

export function OldModuleActionsError() {
    return new SyntaxError(`
    ${errorPrefix} : the old module can't be edit, any action is forbidden.`);
}

export function RouterRootDuplicatedError() {
    return new SyntaxError(`
    ${errorPrefix} : the root config of router module is duplicated.`);
}

export function RoutersConfigUndefinedError() {
    return new SyntaxError(`
    ${errorPrefix} : the routes config is empty.`);
}

export function RoutersDefaultHomeUndefinedError() {
    return new SyntaxError(`
    ${errorPrefix} : the routes' default home page url is not defined, or your default route config is wrong, please check..`);
}

export function SubRoutesNoPathError() {
    return new SyntaxError(`
    ${errorPrefix} : the sub route is set wthout a path and state, it's meaningless, please check.`);
}

export function OtherwiseRoutesDefineError() {
    return new SyntaxError(`
    ${errorPrefix} : the otherwise route is messing or badly defined, please check.`);
}

export const errors = {
    DeclarationExist: DeclarationExistError,
    ElementType: ElementTypeError,
    ModuleDuplicated: ModuleDuplicatedError,
    ElementDuplicated: ElementDuplicatedError,
    ModuleConfigMissing: ModuleConfigMissedError,
    UnisolateScopeBinding: UnisolateScopeBindingError,
    OldModuleActions: OldModuleActionsError,
    RouterRootDuplicated: RouterRootDuplicatedError,
    RoutersConfigUndefined: RoutersConfigUndefinedError,
    RoutersDefaultHomeUndefined: RoutersDefaultHomeUndefinedError,
    SubRoutesNoPath: SubRoutesNoPathError,
    OtherwiseRoutesDefine: OtherwiseRoutesDefineError
};
