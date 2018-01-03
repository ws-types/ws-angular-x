export declare class EventEmitter<T> {
    private event;
    constructor(event?: (parame: {
        $event: T;
    }) => void);
    emit(value: T): void;
}
