/// <reference types="angular" />
import { OnInit, OnChanges, SimpleChanges } from "./../../metadata/life-cycles";
import { CompileService } from "./../services/compile.service";
export declare class NgTemplateOutletDirective implements OnInit, OnChanges {
    private $element;
    private $attrs;
    private compile;
    private ngTemplateOutlet;
    private ngTemplateOutletContext;
    constructor($element: ng.IRootElementService, $attrs: ng.IAttributes, compile: CompileService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
}
