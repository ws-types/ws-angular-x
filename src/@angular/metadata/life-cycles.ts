export interface OnInit {
    ngOnInit(): void;
}

export interface OnDestroy {
    ngOnDestroy(): void;
}

export interface OnChanges {
    ngOnChanges(changes: any): void;
}
