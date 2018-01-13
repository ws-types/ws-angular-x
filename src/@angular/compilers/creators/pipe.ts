import { PipeGenerator } from "./../generators/pipe";
import { IPipeConfig } from "./../../metadata";


export function CreatePipe(config: IPipeConfig) {
    return new PipeGenerator(config);
}
