import { ViewEncapsulation } from "./../../metadata/enums";
import { CssObject } from "./../../metadata";
export interface ICssViewConfig {
    encapsulation?: ViewEncapsulation;
    selector: string;
    styles?: Array<CssObject>;
    style?: CssObject;
    [propName: string]: any;
}
export declare class CssParser {
    private readonly type;
    private classes;
    private parsed_csses;
    private config;
    constructor(config: ICssViewConfig);
    Parse(): () => void;
    Dispose(): () => void;
    private parseCss(css, index);
    private controlRules(target, attr_selector, host_selector);
    private parseRule(rule, attr_selector, host_selector);
}
