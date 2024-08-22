export class EventEmitter<T> {
    private listeners: Array<(data: T) => void> = [];

    on(listener: (data: T) => void) {
        this.listeners.push(listener);
    }

    emit(data: T) {
        this.listeners.forEach((listener) => listener(data));
    }
}
