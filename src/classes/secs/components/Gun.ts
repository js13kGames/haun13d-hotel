import {Mesh} from 'babylonjs';
import {Entity} from '../Entity';
import {Component} from './Component';
import {ControllerInput} from './ControllerInput';
import {MeshEntity} from './MeshEntity';

export class Gun extends Component {
    private _wasTriggerPressed: boolean = false;
    private _fireGunCallback: (position: BABYLON.Vector3, forward: BABYLON.Vector3) => void;

    constructor(fireGunCallback: (position: BABYLON.Vector3, forward: BABYLON.Vector3) => void) {
        super();
        this._fireGunCallback = fireGunCallback;
    }

    override update(deltaTime: number, entity: Entity): void {
        const t = entity.get(ControllerInput).triggerPressed;
        if (t && !this._wasTriggerPressed) {
            const m = entity.get(MeshEntity).mesh as BABYLON.AbstractMesh;
            this._fireGunCallback(m.position, m.forward);
            this._wasTriggerPressed = true;
        }
        if (!t && this._wasTriggerPressed) {
            this._wasTriggerPressed = false;
        }
    }
}
