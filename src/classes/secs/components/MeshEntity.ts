import {Entity} from '../Entity';
import {Component} from './Component';

export class MeshEntity extends Component {
    _mesh: BABYLON.AbstractMesh;

    /**
     * Entity to control a mesh
     * @param {BABYLON.AbstractMesh} mesh
     */
    constructor(mesh: BABYLON.AbstractMesh) {
        super();
        this._mesh = mesh;
    }

    override dispose(): void {
        this._mesh.dispose();
    }
}
