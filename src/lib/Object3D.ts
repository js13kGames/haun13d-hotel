import {Matrix4} from './Math/Matrix4';
import {Quaternion} from './Math/Quaternion';
import {Vector3} from './Math/Vector3';
import {WebGLRenderer} from './WebGLRenderer';

/**
 * Represents a node in a 3D scene graph.
 */
export class Object3D {
    name = '';
    readonly matrix = new Matrix4();
    readonly quaternion = new Quaternion(0, 0, 0, 1);
    readonly position = new Vector3(0, 0, 0);
    readonly scale = new Vector3(1, 1, 1);
    readonly children: Object3D[] = [];
    public isStatic = true;

    public parent: Object3D | null = null;
    public active = true;

    private _absoluteTransform: Matrix4 = new Matrix4().set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    private identity? = true;
    public c = [1, 0, 0, 1];
    get absoluteTransform(): Matrix4 {
        if (!this.parent) return this.matrix;
        if (this.isStatic && !this.identity) return this._absoluteTransform;
        this.identity = true;
        //this._absoluteTransform = new Matrix4();
        this._absoluteTransform.copy(this.parent.matrix);
        this._absoluteTransform.multiply(this.matrix);

        return this._absoluteTransform;
    }

    protected renderer?: WebGLRenderer;

    setRenderer(renderer: WebGLRenderer): void {
        this.renderer = renderer;
    }

    addNode(...children: Object3D[]): void {
        for (const child of children) {
            this.children.push(child);
            child.parent = this;
            child.isStatic = this.isStatic;
            child.setRenderer(this.renderer!);
        }
    }
    removeNode(index: number) {
        this.children.splice(index, 1);
    }

    updateMatrix(): void {
        this.matrix.compose(this.position, this.quaternion, this.scale);
        for (const child of this.children) child.updateMatrix();
    }

    render(projectionMatrix: Float32Array, transform: XRRigidTransform): ObjectData {
        let ret: ObjectData = {m: [], c: []};
        if (!this.active) {
            return ret;
        }
        //const matrices: Matrix4[] = [];
        for (let index = 0; index < this.children.length; index++) {
            const element = this.children[index];
            const data = element.render(projectionMatrix, transform);
            if (data) {
                ret.m.push(...data.m);
                ret.c.push(...data.c);
            }
        }
        return ret;
    }

    update(dt: number): void {
        this.children.forEach((child) => child.update(dt));
    }
}

export type ObjectData = {m: Matrix4[]; c: number[]};
