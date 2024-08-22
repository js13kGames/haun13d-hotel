import {TinyWebXR} from '../lib/TinyWebXR';
import ttt from '../lib/ttt';

export class Game {
    WebXR: TinyWebXR;
    texture!: HTMLCanvasElement;

    constructor() {
        ttt([[32, 32, 13119, 1, 0, 0, 4, 32, 6, 32, 41784, 24856, 33327, 2, 24852, 3, 2, 4100, 1]]).map((x) => {
            x.id = 'b';
            this.texture = x;
        });

        this.WebXR = new TinyWebXR();

        this.WebXR.setClearColor('#400');
        //  this.WebXR.createGroup({n: 'G', ry: 0});
        document.body.appendChild(this.texture);
        this.WebXR.instance({z: -1, b: '#f00', t: this.texture}, 'cube');
        this.WebXR.instance({z: 1, b: '#0f0'}, 'cube');
        this.WebXR.instance({x: -1, b: '#f0f'}, 'cube');
        this.WebXR.instance({x: 1, b: '#00f'}, 'cube');
    }
}
