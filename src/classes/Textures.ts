import ttt from '../lib/ttt';

export class Textures {
    public t: BABYLON.Texture[] = [];

    constructor(s: BABYLON.Scene) {
        const c = ttt(
            //[[32,32,13119,1,0,-16,4,32,6,32,41784,24856,33316,2,24852,3,2,4100,1],[32,32,95,2,244,1],[32,32,13119,1,-9,-16,6,3,8,8,65521,1,34143,1,-12,-12,6,3,8,8,65521,1,38239,2,13110,1],[32,32,21279,0,4,4,24,24,4,65524,17183,1,0,0,1,6,3,6,65521,1,52417,2,12810,1],[32,32,13119,4,2,0,0,32,32,15,1,4,4,17,16,32,32,65528,8,30591,3,5,16,65535,0,12,"13"]]
            // prettier-ignore
            [[32, 32, 43103, 3, 3, 16, 25647, 0, 22, "<>", 3, 0, 31, 25647, 0, 22, "> <", 2, 16918, 1], [32, 32, 47759, 0, -1, 1, 34, 6, 56504, 8, 34671, 2, 34356, 1], [32, 32, 16671, 2, 43076, 2, 2, 16671, 4, 0, 0, 0, 8, 32, 0, 0, 16671], [32, 32, 15, 2, 61448, 1, 2, 1272, 1, 2, 7944, 1, 1, 3, 15, 4, 11, 11, 18, 65528, 8, 30040, 0, 0, 0, 32, 4, 0, 0, 15, 0, 1, 1, 30, 2, 33551, 12559, 65535], [32, 32, 12559, 0, 5, 5, 22, 22, 7, 65522, 12559, 2, 4104, 1], [32, 32, 0, 3, -2, 26, 65535, 0, 26, "👻"], [32, 32, 13119, 0, 1, 1, 14, 14, 48072, 13128, 26239, 0, 17, 1, 14, 14, 63368, 24600, 45631, 0, 1, 17, 14, 14, 32440, 5176, 14447, 0, 17, 17, 14, 14, 48632, 1144, 1999, 2, 8, 1]]
        ).map((x: HTMLCanvasElement, i: number) => {
            this.t.push(
                BABYLON.Texture.LoadFromDataString(
                    't' + i,
                    x.toDataURL(),
                    s,
                    false,
                    false,
                    false,
                    BABYLON.Texture.NEAREST_SAMPLINGMODE
                )
            );
            //#ifdef DEBUG
            document.body.appendChild(x);
            //#endif
            return x;
        });
        const _atlasCanvas = document.createElement('canvas');
        _atlasCanvas.width = _atlasCanvas.height = 128;
        const _atlasContext = _atlasCanvas.getContext('2d')!;
        c.forEach((texture, index) => {
            const x = (index % 4) * 32;
            const y = Math.floor(index / 4) * 32;
            _atlasContext.drawImage(texture, x, y, 32, 32);
        });
        //#ifdef DEBUG
        document.body.appendChild(_atlasCanvas);
        //#endif
        // add the atlas to the first position in the array.
        this.t.splice(
            0,
            0,
            BABYLON.Texture.LoadFromDataString(
                'atlas',
                _atlasCanvas.toDataURL(),
                s,
                false, // deletebuffer
                false, // mipmap
                true, // invertY
                BABYLON.Texture.NEAREST_SAMPLINGMODE
            )
        );
    }
}
