
export interface CssOnject { [key: string]: any; }

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
