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
        console.log('Disposing mesh entity');
        this._mesh.dispose();
    }
}
