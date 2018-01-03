import { Injectable } from "./../../@angular";


@Injectable()
export class AnotherService {

    private fuck = "hahahah";

    constructor() {

    }

    public getFuck() {
        return this.fuck;
    }

}
