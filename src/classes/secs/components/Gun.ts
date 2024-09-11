import {Mesh} from 'babylonjs';
import {Entity} from '../Entity';
import {Component} from './Component';
import {ControllerInput} from './ControllerInput';
import {MeshEntity} from './MeshEntity';
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
            const m = entity.get(MeshEntity)._mesh as BABYLON.AbstractMesh;
            this._fireGunCallback(m.position, m.forward);
            this._wasTriggerPressed = true;

            const rayMesh = BABYLON.MeshBuilder.CreateBox(
                'rayMesh',
                {height: 0.01, width: 0.01, depth: 20},
                Game.instance.scene
            );
            // Position and rotate the cube to align with the ray
            rayMesh.position = m.position.add(m.forward.scale(10)).add(m.up.scale(0.05));

            rayMesh.rotationQuaternion = m.rotationQuaternion;

            // Optionally, set the cube's color for better visibility
            const material = new BABYLON.StandardMaterial('rayMaterial', Game.instance.scene);
            material.emissiveColor = new BABYLON.Color3(0, 1, 1);
            rayMesh.material = material;

            setTimeout(() => rayMesh.dispose(), 25);
        }
        if (!t && this._wasTriggerPressed) {
            this._wasTriggerPressed = false;
        }
    }
}
