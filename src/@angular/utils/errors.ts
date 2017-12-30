
const errorPrefix = "# AngularX #";

export function DeclarationExistError(selector?: string) {
    return new Error(`
    ${errorPrefix} : the declaration of target is exist, you can't include an exist element twice.
        ${selector ? "the selector of target is " + selector : ""}
    `);
}

export function ElementTypeError(element?: any) {
    return new TypeError(`
    ${errorPrefix} : the element's type is invalid, you can't include the error type instance in bundle.
        ${element ? "the details of element is : " + JSON.stringify(element) : ""}`);
}
