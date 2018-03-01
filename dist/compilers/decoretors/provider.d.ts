import "reflect-metadata";
import { IProviderConfig, IProviderClass, IClass, ICommonController, I18nPropery } from "./../../metadata";
import { NGX_I18N_CONFIG } from "./../../i18n";
export declare function Injectable(config?: IProviderConfig | string): <T extends IProviderClass>(target: T) => void;
export declare function $Injectable(config?: IProviderConfig | string): {
    Decorate: <T extends IProviderClass>(target: T) => T;
};
export declare function buildI18nData(instance: any, i18n_conf: NGX_I18N_CONFIG, i18n_propery: I18nPropery): void;
export declare function injectI18n<T extends any>(target: T): any;
export declare function parseInjectsAndDI<T extends IClass<any, ICommonController>>(target: T, types: any[]): string[];
