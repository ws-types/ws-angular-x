import { IProviderConfig, IProviderClass } from "@angular/metadata";
import { CreateProvider } from "../creators/provider";


export function Injectable(config?: IProviderConfig | string) {
    return function decorator<T extends IProviderClass>(target: T) {
        const generator = createProvider(config);
        target.generator = generator;
    };
}

export function $Injectable(config?: IProviderConfig | string) {
    return {
        Class: <T extends IProviderClass>(target: T): T => {
            const generator = createProvider(config);
            target.generator = generator;
            return target;
        }
    };
}

function createProvider(config: string | IProviderConfig) {
    const nConfig = !config ? { selector: null } : typeof (config) === "string" ? { selector: config } : config;
    const generator = CreateProvider(nConfig);
    return generator;
}

