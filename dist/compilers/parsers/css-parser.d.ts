import { ViewEncapsulation } from "@angular/metadata/enums";
import { CssOnject } from "@angular/metadata";
export interface ICssViewConfig {
    encapsulation?: ViewEncapsulation;
    selector: string;
    styles?: CssOnject[];
    style?: CssOnject;
    [propName: string]: any;
}
export declare class CssParser {
    private readonly type;
    private classes;
    private parsed_csses;
    private config;
    constructor(config: ICssViewConfig);
    Parse(): () => void;
}
