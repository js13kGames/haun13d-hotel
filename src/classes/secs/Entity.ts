import {Secs} from './secs';

export class Entity {
    id: number;
    secs: Secs;

    /**
     * instantiates a new Entity;
     * @param {number} id the unique id of the entity
     * @param {Secs} secs the instance of secs
     */
    constructor(id: number, secs: Secs) {
        this.id = id;
        this.secs = secs;
    }
    /**
     * Retrieves the specified component.
     */
    get(comp) {
        return this.secs.entitiesToComponents[this.id][comp.name];
    }
    /**
     * Adds the specified component.
     */
    add(component) {
        var name = component.constructor.name;
        if (!this.secs.componentsToEntities[name]) {
            this.secs.componentsToEntities[name] = [];
        }

        this.secs.entitiesToComponents[this.id][name] = component;
        this.secs.componentsToEntities[name][this.id] = true;
    }
    /**
     * Removes the specified component.
     */
    // remove (component) {
    //     delete this.secs.entitiesToComponents[this.id][component.name];
    //     delete this.secs.componentsToEntities[component.name][this.id];
    // }
    /**
     * Kills the entity.
     */
    kill() {
        delete this.secs.entities[this.id];
        delete this.secs.entitiesToComponents[this.id];
        for (var comp in this.secs.componentsToEntities) {
            delete this.secs.componentsToEntities[comp][this.id];
        }
    }
}
