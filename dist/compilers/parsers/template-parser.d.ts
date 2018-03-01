import { ViewEncapsulation } from "./../../metadata";
import { ElementRef } from "../../core/template/elementRef";
export declare const NgContentPrefix = "_ngcontent-v2";
export declare const NgHostPrefix = "_nghost-v2";
export interface ITemplateViewConfig {
    encapsulation?: ViewEncapsulation;
    selector: string;
    template?: string;
    useAST?: boolean;
    [propName: string]: any;
}
export declare class TemplateParser {
    private readonly type;
    private template;
    private loaded_temp;
    private config;
    private ngxTemps;
    constructor(config?: ITemplateViewConfig);
    GetNgTemplate(selector: string): ElementRef<any>;
    Parse(): string;
    private parseTemplate(tpl, selector, type);
    private parseNode(element, selector);
}
