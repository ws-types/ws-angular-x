
export class EventEmitter<T> {

    constructor(private event?: (parame: { $event: T }) => void) { }

    public emit(value: T) {
        this.event({ $event: value });
    }

}
