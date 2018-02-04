import {
    Component, OnInit, OnDestroy, ViewEncapsulation,
    $Inject, $Injects, ViewChild, HTMLNgTemplate,
    TemplateRef, AfterViewInit, Input, OnChanges,
    SimpleChanges
} from "@angular";

@Component({
    selector: "test-tabs",
    template: `
    <div>
        <ng-template class="tabs-container"></ng-template>
    </div>
    `,
    styleUrls: [],
})
export class TabsComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

    @Input()
    private tabTemplate: TemplateRef<any>;

    @Input()
    private tabsData: Array<{ title: string }>;

    ngOnInit(): void {

    }

    ngOnDestroy(): void {

    }

    ngAfterViewInit(): void {
        console.log(this.tabTemplate);
    }

    ngOnChanges(changes: SimpleChanges): void {
        for (const prop in changes) {
            if (prop === "tabTemplate") {
                console.log(changes[prop].currentValue);



            }
        }
    }

}
