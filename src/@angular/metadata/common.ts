export type I18nConfig = I18nPropery | boolean;

export interface I18nPropery {
    ext?: "json" | "yaml";
    root?: string;
    alias?: string;
    files?: { [fileName: string]: string };
}

export interface CssObject extends CssStylesheet {
    [key: string]: any;
}

export enum CssContentType {
    Stylesheet = "stylesheet",
    Rule = "rule",
    Declaration = "declaration",
    Comment = "comment",
    Charset = "charset",
    CustomMedia = "custom-media",
    Document = "document",
    FontFace = "font-face",
    Host = "host",
    Import = "import",
    Keyframes = "keyframes",
    Keyframe = "keyframe",
    Media = "media",
    Namespace = "namespace",
    Page = "page",
    Supports = "supports",
}

export interface CssStylesheet {
    rules?: Array<CssRule | CssMedia>;
    parsingErrors?: Array<any>;
}

export interface CssRule {
    type: CssContentType;
    position: CssPosition;
    selectors?: Array<string>;
    declarations?: Array<CssDeclaration>;
    rules?: Array<CssRule>;
}

export interface CssMedia {
    type: CssContentType;
    position: CssPosition;
    media?: string;
    rules?: Array<CssRule>;
}

export interface CssKeyframe {
    type: CssContentType;
    position: CssPosition;
    name?: string;
    keyframes?: Array<{
        type: CssContentType;
        position: CssPosition;
        values: Array<string>;
        declarations: Array<CssDeclaration>;
    }>;
}

export interface CssPosition {
    start: { line: number; column: number; };
    end: { line: number; column: number; };
}

export interface CssDeclaration {
    type: CssContentType;
    position: CssPosition;
    property: string;
    value: string;
}

export enum RequireScope {
    Current = "",
    Parent = "^^",
    InnerParent = "^",
}

export type RequireEScope = RequireScope | "" | "^" | "^^";

export enum RequireStrict {
    Strict = "",
    Unstrict = "?"
}

export type RequireEStrict = RequireStrict | boolean | "" | "?";

export enum InputType {
    String,
    OneWay,
    TwoWay
}

export type InptuEType = InputType | boolean;
