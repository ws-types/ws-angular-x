import {
    Component, OnInit, OnDestroy, ViewEncapsulation,
    $Inject, $Injects, ViewChild, HTMLNgTemplate,
    TemplateRef, AfterViewInit
} from "@angular";

@Component({
    selector: "test-temp-ref",
    templateUrl: "./test.html",
    styleUrls: [],
})
export class TestTempRefComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild()
    private innerContent: TemplateRef<HTMLNgTemplate>;

    public tabs = [
        { title: "aaa" },
        { title: "bbb" },
        { title: "ccc" }
    ];

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {
        console.log(this.innerContent.nativeElement);
    }

}
