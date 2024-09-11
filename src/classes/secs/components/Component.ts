import {Entity} from '../Entity';

export abstract class Component {
    update(deltaTime: number, entity: Entity): void {}
    dispose(): void {}
}
