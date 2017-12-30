import camelCase from "camelcase";

export function SelectorParse(selector: string) {
    return camelCase(selector);
}
