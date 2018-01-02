export interface SimpleChanges {
    [propName: string]: ISimpleChange;
}
export interface ISimpleChange {
    currentValue: any;
    previousValue: any;
}
export interface OnInit {
    ngOnInit(): void;
}
export interface OnDestroy {
    ngOnDestroy(): void;
}
export interface OnChanges {
    ngOnChanges(changes: SimpleChanges): void;
}
export interface DoCheck {
    ngDoCheck(): void;
}
