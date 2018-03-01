import { Injectable } from "../../compilers/decoretors/provider";
import {
    ITranscludeFunction, ITemplateLinkingFunction, IScope,
    ICloneAttachFunction, ITemplateLinkingFunctionOptions
} from "angular";
import { NGX_I18N_CONFIG } from "./../../i18n";

@Injectable("@compile")
export class CompileService {

    constructor(private $compile: ng.ICompileService) {

    }

    link(
        element: string | Element | JQuery<HTMLElement>,
        scope: IScope,
        transclude?: ITranscludeFunction,
        maxPriority?: number,
        cloneAttachFn?: ICloneAttachFunction,
        options?: ITemplateLinkingFunctionOptions) {
        return this.$compile(element, transclude, maxPriority)(scope, cloneAttachFn, options);
    }

}
