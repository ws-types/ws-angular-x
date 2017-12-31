import { Injectable } from "@angular";
import { AnotherService } from "@src/services/another.service";


@Injectable()
export class AppService {

    constructor(private bservice: AnotherService) {

    }

}
