import "reflect-metadata";
import * as uuid from "uuid/v4";

export const InputMetaKey = Symbol("ng-metadata:Input");
export const OutputMetaKey = Symbol("ng-metadata:Output");

export interface IInputProperty {
    isString: boolean;
    keyName: string;
}

export function Input(isString = false) {
    return function inputDecorator(target, propertyKey: string) {
        const values: IInputProperty[] = Reflect.getMetadata(InputMetaKey, target) || [];
        values.push({ isString: isString, keyName: propertyKey || uuid() });
        Reflect.defineMetadata(InputMetaKey, values, target);
    };
}

export function Output(config?: any) {
    return function inputDecorator(target, propertyKey: string) {
        const values: string[] = Reflect.getMetadata(OutputMetaKey, target) || [];
        values.push(propertyKey || uuid());
        Reflect.defineMetadata(OutputMetaKey, values, target);
    };
}
