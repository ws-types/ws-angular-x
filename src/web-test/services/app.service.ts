import { Injectable } from "@angular";
import { AnotherService } from "@src/services/another.service";
import { Router } from "@angular/router";


@Injectable({ i18n: true })
export class AppService {

    private i18n: any;

    constructor(public router: Router, private bservice: AnotherService) {
        // setTimeout(() => {
        //     console.log(this.i18n);
        // }, 0);
    }

}
