import {Component} from './Component';

export enum handedness {
    LEFT = 'left',
    RIGHT = 'right',
}

export class ControllerInput extends Component {
    _handedness: handedness;
    _triggerPressed: boolean = false;

    constructor(handedness: handedness) {
        super();
        this._handedness = handedness;
    }
}
