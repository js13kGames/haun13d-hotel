import { lerp } from "../../Maths";
import { Entity } from "../Entity";
import { Component } from "./Component";
import { MeshEntity } from "./MeshEntity";

export class Scale extends Component {
    private _t: number;

    constructor(private _from:number, private _to: number, private _time:number) {
        super();
        this._t = 0;
    }

    override update(deltaTime: number, entity: Entity): void {
        this._t+= deltaTime / 1000;
        const v = lerp(this._from, this._to, this._t);
        entity.get(MeshEntity)._mesh.scaling.set(v,v,v);
        if(v>=this._to) entity.kill();
    }
}