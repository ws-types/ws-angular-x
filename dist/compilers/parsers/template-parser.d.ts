import { ViewEncapsulation } from "@angular/metadata";
export interface ITemplateViewConfig {
    encapsulation?: ViewEncapsulation;
    selector: string;
    template?: string;
    [propName: string]: any;
}
export declare class TemplateParser {
    private readonly type;
    private template;
    private config;
    constructor(config?: ITemplateViewConfig);
    Parse(): string;
}
