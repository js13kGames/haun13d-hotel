import {EventEmitter} from './EventEmitter';
import {Object3D} from './Object3D';

export class Controller extends Object3D {
    onTrigger: EventEmitter<Boolean> = new EventEmitter();

    private _triggerPressed = false;
    private handedness: string;
    public get triggerPressed(): boolean {
        return this._triggerPressed;
    }
    public set triggerPressed(value: boolean) {
        if (value != this._triggerPressed) {
            //console.log(`triggerPressed(${this.handedness})=${value}`);
            this.onTrigger.emit(value);
            this._triggerPressed = value;
        }
    }

    constructor(handedness: 'left' | 'right') {
        super();
        this.isStatic = false;
        this.handedness = handedness;
    }
}
