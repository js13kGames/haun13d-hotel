import {IComponent} from './IComponent';

export enum handedness {
    LEFT = 'left',
    RIGHT = 'right',
}

export class ControllerInput implements IComponent {
    handedness: handedness;
    constructor(handedness: handedness) {
        this.handedness = handedness;
    }
}
