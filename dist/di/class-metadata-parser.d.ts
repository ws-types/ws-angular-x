export declare class ClassMetadataParser {
    static COMMENTS: RegExp;
    static DEFAULT_PARAMS: RegExp;
    static FAT_ARROWS: RegExp;
    static CLASS_HEAD: RegExp;
    static CTOR_HEAD: RegExp;
    static GetES5CtorParamsName(fn: any): string[];
    static GetES6CtorParamsName(c: any): any;
}
