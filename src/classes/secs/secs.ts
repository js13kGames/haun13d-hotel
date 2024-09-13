import {Component} from './components/Component';
import {Entity} from './Entity';

export class Secs {
    _nextID = 0;
    _entities: Entity[] = [];
    _entitiesToComponents: Component[] = [];
    _componentsToEntities = {};
    _system = {};

    _registerSystems(systems) {
        systems.forEach((s) => {
            var name = s.constructor.name;
            this._system[name] = s;
        });
    }

    /**
     * Creates a new entity.
     */
    _createEntity(components) {
        var entityID = this._nextID++;
        var entity = new Entity(entityID, this);

        this._entities[entityID] = entity;
        this._entitiesToComponents[entityID] = {} as Component;

        if (components) {
            components.forEach((component) => {
                entity.add(component);
            });
        }

        return entity;
    }

    /**
     * Returns all entities having the specified component.
     */
    match<T>(comp: {new (...args: any[]): T}): Entity[] {
        return Object.keys(this._componentsToEntities[comp.name] || []).map((entityID) => {
            return this._entities[entityID];
        });
    }
}

let secs = new Secs();
