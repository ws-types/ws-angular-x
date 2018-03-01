import { Injectable } from "./../compilers/decoretors/provider";
import { I18N_SELECTOR } from "./config";
export { I18N_SELECTOR };

@Injectable(I18N_SELECTOR)
// tslint:disable-next-line:class-name
export class NGX_I18N_CONFIG {
    private default: string;
    private locale: string;
    public get Locale() { return this.locale || this.default; }
}
