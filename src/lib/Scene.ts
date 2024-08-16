import {GameObject} from './GameObject';

export class Scene {
    updateInputSources(frame: XRFrame, xrRefSpace: XRReferenceSpace | undefined) {}

    objects: GameObject[];

    constructor() {
        this.objects = [];
    }
    addObject(obj) {
        this.objects.push(obj);
    }
    removeObject(obj) {
        /* Remove object from array */
    }

    update(dt: number) {
        this.objects.forEach((obj) => obj.update());
    }

    render(renderer) {
        renderer.render(this);
    }
}
