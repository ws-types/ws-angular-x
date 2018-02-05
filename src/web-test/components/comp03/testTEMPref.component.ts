import {
    Component, OnInit, OnDestroy, ViewEncapsulation,
    $Inject, $Injects, ViewChild, HTMLNgTemplate,
    TemplateRef, AfterViewInit, ElementRef
} from "@angular";

@Component({
    selector: "test-temp-ref",
    templateUrl: "./test.html",
    styleUrls: [],
})
export class TestTempRefComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild()
    private innerContent: ElementRef<HTMLNgTemplate>;

    @ViewChild()
    private innerContent2: ElementRef<HTMLNgTemplate>;

    public type = 1;

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

    }

    public changeTemp() {
        this.type = this.type === 1 ? 2 : 1;
    }

}
