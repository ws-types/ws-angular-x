import * as camelCase from "camelcase";

export function SelectorParse(selector: string): string {
    return camelCase(selector);
}
