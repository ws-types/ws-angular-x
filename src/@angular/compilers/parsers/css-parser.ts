import * as css from "css";
import { ViewEncapsulation } from "@angular/metadata/enums";

export interface CssOnject { [key: string]: any; }

export interface ICssViewConfig {
    encapsulation?: ViewEncapsulation;
}

export class CssParser {

    private classes: CssOnject[] = [];
    private config: any;

    constructor(classes: string[], config?: any) {
        this.config = config || { encapsulation: ViewEncapsulation.Emulated };
        classes.forEach(i => {
            this.classes.push(cssObjectParse(i));
        });
    }

    public Parse(selector: string): () => void {
        return () => { };
    }

}

function cssObjectParse(source) {
    const parsedStylesheet = css.parse(source).stylesheet;
    const selectors = parsedStylesheet && parsedStylesheet.rules.reduce(reduceRulesToSelectors, {});
    return selectors;
}

function isValidRule(rule) {
    return !!(rule.type === "rule" && rule.selectors && rule.selectors.length);
}

function isValidDeclaration(declaration) {
    return !!(declaration.type === "declaration" && declaration.property && declaration.property.length);
}

function reduceDeclarationsToStyleObject(styleObj, declaration) {
    if (!isValidDeclaration(declaration)) {
        return styleObj;
    }
    styleObj[declaration.property] = declaration.value;
    return styleObj;
}

function reduceRulesToSelectors(selectors, rule) {
    if (!isValidRule(rule)) {
        return selectors;
    }
    const styleObject = rule.declarations.reduce(reduceDeclarationsToStyleObject, {});
    rule.selectors.forEach((selector) => {
        selectors[selector] = Object.assign({},
            selectors[selector],
            styleObject
        );
    });
    return selectors;
}
