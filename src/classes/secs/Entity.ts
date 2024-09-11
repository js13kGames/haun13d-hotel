import {Component} from './components/Component';
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
    //get(comp) {
    get<T>(comp: {new (...args: any[]): T}): T {
        return this.secs._entitiesToComponents[this.id][comp.name] as T;
    }

    /**
     * Adds the specified component.
     */
    add(_component: any) {
        var name = _component.constructor.name;
        if (!this.secs._componentsToEntities[name]) {
            this.secs._componentsToEntities[name] = [];
        }

        this.secs._entitiesToComponents[this.id][name] = _component;
        this.secs._componentsToEntities[name][this.id] = true;
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
        const {id, secs} = this;
        delete secs._entities[id];
        const e = secs._entitiesToComponents[id];
        for (const k in e) e[k]?.dispose();
        delete secs._entitiesToComponents[id];
        for (const comp in secs._componentsToEntities) delete secs._componentsToEntities[comp][id];
    }
}
