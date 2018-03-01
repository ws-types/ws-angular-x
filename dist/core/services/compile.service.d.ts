/// <reference types="angular" />
import { ITranscludeFunction, IScope, ICloneAttachFunction, ITemplateLinkingFunctionOptions } from "angular";
export declare class CompileService {
    private $compile;
    constructor($compile: ng.ICompileService);
    link(element: string | Element | JQuery<HTMLElement>, scope: IScope, transclude?: ITranscludeFunction, maxPriority?: number, cloneAttachFn?: ICloneAttachFunction, options?: ITemplateLinkingFunctionOptions): JQLite;
}
