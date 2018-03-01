import { IPipeConfig, IPipeClass } from "./../../metadata";
export declare function Pipe(config: IPipeConfig | string): <T extends IPipeClass>(target: T) => void;
export declare function $Pipe(config?: IPipeConfig | string): {
    Decorate: <T extends IPipeClass>(target: T) => T;
};
