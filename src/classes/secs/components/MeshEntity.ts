import {IComponent} from './IComponent';

export class MeshEntity implements IComponent {
    mesh: BABYLON.AbstractMesh;
    /**
     * Entity to control a mesh
     * @param {BABYLON.AbstractMesh} mesh
     */
    constructor(mesh: BABYLON.AbstractMesh) {
        this.mesh = mesh;
    }
}
