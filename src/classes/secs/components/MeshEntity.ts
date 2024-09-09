import {Entity} from '../Entity';
import {Component} from './Component';

export class MeshEntity extends Component {
    mesh: BABYLON.AbstractMesh;

    /**
     * Entity to control a mesh
     * @param {BABYLON.AbstractMesh} mesh
     */
    constructor(mesh: BABYLON.AbstractMesh) {
        super();
        this.mesh = mesh;
    }
}
