import {ControllerInput} from '../components/ControllerInput';
import {MeshEntity} from '../components/MeshEntity';
import {Entity} from '../Entity';

export class InputSystem {
    _xrControllers: BABYLON.WebXRInputSource[] = [];
    _lastPosition = {};
    _data = {};
    _triggerPressed: boolean = false;

    _controllers(entity, dt) {
        if (this._xrControllers) {
            this._xrControllers.forEach((controller) => {
                this._handleController(entity, controller);
                // this.trackDirection(entity, controller, dt);
            });
        }
    }

    /**
     * @param {Entity} entity;
     * @param {BABYLON.WebXRInputSource} controller
     */
    _handleController(entity: Entity, controller: BABYLON.WebXRInputSource) {
        var inputEntity = entity.get(ControllerInput);
        if (controller.inputSource.handedness == inputEntity._handedness) {
            var mesh = entity.get(MeshEntity)._mesh;
            mesh.position.copyFrom(controller.grip!.position);
            mesh.rotationQuaternion = controller.grip!.rotationQuaternion;
            mesh.rotate(BABYLON.Vector3.Right(), Math.PI / 4);
            if (controller.inputSource.gamepad!.buttons[0].value == 1) {
                inputEntity._triggerPressed = true;
                this._triggerPressed = true;
            }
            if (controller.inputSource.gamepad!.buttons[0].value < 0.5) {
                inputEntity._triggerPressed = false;
                this._triggerPressed = false;
            }
        }
    }
}
