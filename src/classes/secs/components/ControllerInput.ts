import {Component} from './Component';

export enum handedness {
    LEFT = 'left',
    RIGHT = 'right',
}

export class ControllerInput extends Component {
    handedness: handedness;
    constructor(handedness: handedness) {
        super();
        this.handedness = handedness;
    }
}
