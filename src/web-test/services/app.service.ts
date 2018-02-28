import { Injectable } from "@angular";
import { AnotherService } from "@src/services/another.service";
import { Router } from "@angular/router";


@Injectable({ i18n: true })
export class AppService {

    constructor(public router: Router, private bservice: AnotherService) {

    }

}
