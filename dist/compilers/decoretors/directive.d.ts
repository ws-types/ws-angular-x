import { IDirectiveConfig, IDirectiveClass } from "@angular/metadata";
export declare function Directive(config: IDirectiveConfig): <T extends IDirectiveClass>(target: T) => void;
export declare function $Directive(config: IDirectiveConfig): {
    Decorate: <T extends IDirectiveClass>(target: T) => T;
};
