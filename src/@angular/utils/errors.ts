
const errorPrefix = "AngularX";

export function DeclarationExistError(selector?: string) {
    return new Error(`
    ${errorPrefix} : the declaration of target is exist, you can't include an exist element twice.
    ${selector ? " the selector of target is " + selector : ""}
    `);
}
