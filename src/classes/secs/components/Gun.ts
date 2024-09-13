import {Entity} from '../Entity';
import {Component} from './Component';
import {ControllerInput} from './ControllerInput';
import {Game} from '../../Game';

export class Gun extends Component {
    private _wasTriggerPressed: boolean = false;
    private _fireGunCallback: (position: BABYLON.Vector3, forward: BABYLON.Vector3) => void;

    constructor(fireGunCallback: (position: BABYLON.Vector3, forward: BABYLON.Vector3) => void) {
        super();
        this._fireGunCallback = fireGunCallback;
    }

    override update(deltaTime: number, entity: Entity): void {
        const t = entity.get(ControllerInput)._triggerPressed;
        if (t && !this._wasTriggerPressed) {
            const m = Game.instance._gun;

            this._fireGunCallback(m.position, m.forward);
            this._wasTriggerPressed = true;

            const rayMesh = BABYLON.MeshBuilder.CreateBox(
                '',
                {height: 0.1, width: 0.03, depth: 30},
                Game.instance.scene
            );
            rayMesh.parent = m;
            rayMesh.resetLocalMatrix(true);
            rayMesh.position.z = 15.3;
            rayMesh.position.y = 0.3;
            const material = new BABYLON.StandardMaterial('', Game.instance.scene);
            material.emissiveColor = new BABYLON.Color3(0, 1, 1);
            rayMesh.material = material;

            setTimeout(() => rayMesh.dispose(), 25);
        }
        if (!t && this._wasTriggerPressed) {
            this._wasTriggerPressed = false;
        }
    }
}
