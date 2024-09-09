import ttt from '../lib/ttt';
const _GhostTexture =
    'data:image/webp;base64,UklGRk4EAABXRUJQVlA4WAoAAAAQAAAAjwAALwAAQUxQSIMAAAABDzD/ERHCdSS7bYPSFRpDJ0YBDvhU4OA5ACAoNxDR/wkgXwGAslNKHUk1R1MItmjytgwXyJ/oJTavjWlXsgL0TQVcIAV6ia2gpbYCdSwlDkDawQBJAUf8Y10TANCUYodS2jOBtoK7ZxnuoSHIiGcjLGojWrQVKG7eFjFWTyMiMkdSIQBWUDggpAMAAPASAJ0BKpAAMAA+kTyXSCWjIiEuNA1QsBIJZwDLYKpKab+pw38j4S1onWu32XVps2gd4An51b74yyfe9OcUHP63EesQcieVtZkk1V8ov2qK2tv7/yLs1aYFgDkGJAjLERjp6nQx1hluIauL6IL3agfn3+fDBpT6KrXg/Tc/Sh5TPvgUdcZYnxC843Hgsq3nO/VDwPi+NEzV6EDLxOaniRAA/vytETeuMat0p+FG9jOfb012ltscBtuZeZBi+eKexbiJhZ9mdMvjAh99O5rLXEz8mm1jRoNZfr/qKPXWUY/NFD8RNe00t3dfASmJRSk+JNxrHS9IL4W2aNpKytmRvkX4i5hixTp1pAE4h+gtOgDuppTVJIiH6zb5jURJg98mW31IUtI+4axx414KTP0N8dKBcfN82huUPmVAFSMdT6OhfuDuVSoUn/1QnfKjcDD0leFcp0d6C24//0nehz3P0/miKTPkfxEj21JvwdFzIddydFsudGM3TD9Vny2Bdz7NM6nxBRxeKqn9ZFPt3L+6cOpIFqLEoINIA1f7gPdE/+OyfHMhj0zt3neMDqDd0R1vjf5IbgExbVyXepiyBRbgPzLbmUHiaesoyD0Q7WCrQweAVfcrzrwWMv5kYmHAWfm7YvGgNISAO6BHa8ggHH7OyKhHCGukAJULBf0uMLb2Zb8uEu6Ff4xrqBudAQ39kp/XgxasZGOe/EXO8hwa+5UZ0uY9BMTsNeM9MKLdc291Yg/uISstpWCwEXhMaxEdQGwtlW0jYBozM29+iwhnyXo/xrbZFf94eFoELfCokDG6hzmzmjiqgygjm/0QnnaesTiutlwFFNwxbNF0eosLDxCJkUroyppwzkcUb9aWYCAQET7P32pglujDrnyD3VXqEzJtwSMv1Hu7WMlX46a2UpVjzkJlNxhBg0GFiDsQvBJCBT/2BHSqU/+BApyp7rxM5eLKV0CxAweQI49wXxkRjbSuSFgK2z6khFvud1Yifr70xe8KguUMsrfBLd88Je+1owCjJI/njcORwG5tXuAzD1A3zXLb0j9lMGopXhzpFT7eN8clGc6qREUsn8u5a3fVQL9um06p0FHLA1zUjLUwdcJMRTdA7+MK7rN2FQ+Nqne3K6hvsFjTqD1ZsIBs7HwvTWS2B4iAtJNCjA2ZhBJnrgZiGgnqaCh16Mc7GbYldOLXzEtQaypMXKyGt0wlhb/sdHYoJ6mJU+o1pChdnORdaDOZIivflAAA';
const _GunTexture =
    'data:image/webp;base64,UklGRjoBAABXRUJQVlA4IC4BAACQBgCdASoYABgAPpE6mEiloyIhMBgIALASCWgAsR9W1MCNBCAaxAdnwSmnvXY5AJB8XT3eVC7NEo306FbAAP70lPcUnlTpuLadkfXRwbxMV2jE/sFruOEe4l8a4y+tjSEfmfc7BNAnX8w47dFCV9TS3P6gkokI7BaTGFyESH4rhqe18cbcSYvb10PUhjizwb/Q4kfWuB46tiRbZty3+Yh9E5tBjGAwqsm6XPyEcLQNiUljYwqfTQ0VbCTZ4FfjGRIrpi5ImB8yYtmqFXt24iLcFBzEkVP+w0MifD3iJ350b2V7tomZ6KgH3nQ4yDAdDMtj76W+WNw4jvxTZwVsribE4TcgM43AhOpkVVpDAAmombKKAjqFNVW7jITVKdPzwsin6vmO0OOQAqPoLGAAAA==';
export class Textures {
    public t: BABYLON.Texture[] = [];

    async load(s: BABYLON.Scene): Promise<void> {
        return new Promise((resolve) => {
            const c = ttt(
                //[[32,32,13119,1,0,-16,4,32,6,32,41784,24856,33316,2,24852,3,2,4100,1],[32,32,95,2,244,1],[32,32,13119,1,-9,-16,6,3,8,8,65521,1,34143,1,-12,-12,6,3,8,8,65521,1,38239,2,13110,1],[32,32,21279,0,4,4,24,24,4,65524,17183,1,0,0,1,6,3,6,65521,1,52417,2,12810,1],[32,32,13119,4,2,0,0,32,32,15,1,4,4,17,16,32,32,65528,8,30591,3,5,16,65535,0,12,"13"]]
                // prettier-ignore
                //[[32,32,43103,3,3,16,25647,0,22,"<>",3,0,31,25647,0,22,"> <",2,16918,1],[32,32,47759,0,-1,1,34,6,56504,8,34671,2,34356,1],[32,32,16671,2,43076,1,2,16671,1,0,4,4,16,16,0,0,63234,0,12,12,16,16,0,0,45602],[32,32,15,2,61448,1,2,1272,1,2,7944,1,1,3,15,4,11,11,18,65528,8,30040,0,0,0,32,4,0,0,15,0,1,1,30,2,33551,12559,65535],[32,32,12559,0,5,5,22,22,7,65522,12559,2,4104,1],[32,32,0,3,-2,26,65535,0,26,"👻"],[32,32,13119,0,1,1,14,14,48072,13128,26239,0,17,1,14,14,63368,24600,45631,0,1,17,14,14,32440,5176,14447,0,17,17,14,14,48632,1144,1999,2,8,1]]
                [[96,96,43103,2,16918,1,1,0,0,8,8,16,16,65522,2,43094],[96,96,47759,1,1,1,46,46,48,48,65522,2,47749,2,34357,1,4,7,0,0,960,960,8],[96,96,16671,2,43076,1,2,16671,1,0,4,4,16,16,0,0,63234,0,12,12,16,16,0,0,45602],[96,96,15,2,61448,1,2,1272,1,2,7944,1,1,3,15,4,11,11,18,65528,8,30040,0,0,0,32,4,0,0,15,0,1,1,30,2,33551,12559,65535],[96,96,12559,0,5,5,22,22,7,65522,12559,2,4104,1],[96,96,0,3,-2,74,65535,0,72,"👻"],[96,96,13119,0,1,1,14,14,48072,13128,26239,0,17,1,14,14,63368,24600,45631,0,1,17,14,14,32440,5176,14447,0,17,17,14,14,48632,1144,1999,2,8,1],[96,96,15,2,4,2.6,2,52420,1.7]]
                //[[128,128,0,2,3,1.4,2,17480,1.3],[128,128,61087,2,30580,1,4,0,0,0,512,1280,6],[128,128,8751,1,1,1,30,62,64,64,65528,8,29444,1,33,-30,31,62,64,64,65528,8,29443,4,0,0,0,128,1280,15]]
            ).map((x: HTMLCanvasElement, i: number) => {
                this.t.push(
                    BABYLON.Texture.LoadFromDataString('t' + i, x.toDataURL(), s, false, false, false, BABYLON.Texture.NEAREST_SAMPLINGMODE)
                );
                //#ifdef DEBUG
                document.body.appendChild(x);
                //#endif
                return x;
            });
            const tsize = 96;
            const _atlasCanvas = document.createElement('canvas');
            _atlasCanvas.width = _atlasCanvas.height = tsize * 4;
            const _atlasContext = _atlasCanvas.getContext('2d')!;
            c.forEach((texture, index) => {
                const x = (index % 4) * tsize;
                const y = Math.floor(index / 4) * tsize;
                _atlasContext.drawImage(texture, x, y, tsize, tsize);
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

            this.t.push(
                BABYLON.Texture.LoadFromDataString('ghost', _GhostTexture, s, false, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE)
            );

            this.t.push(
                BABYLON.Texture.LoadFromDataString('gun', _GunTexture, s, false, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE)
            );

            const _canvas = document.createElement('canvas');
            const _ctx = _canvas.getContext('2d')!;
            const _img = new Image();
            _img.src = _GunTexture;

            _img.onload = () => {
                // Set canvas dimensions to match the image
                _canvas.width = _img.width;
                _canvas.height = _img.height;

                // Draw the image onto the canvas
                _ctx.drawImage(_img, 0, 0);

                let imageData = _ctx.getImageData(0, 0, _canvas.width, _canvas.height);
                let data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                    data[i] = data[i + 1] = data[i + 2] = Math.max(data[i + 2] * 2 - 196, 0);
                    //Math.max(data[i + 2] - 128, 0) * 2;
                }
                _ctx.putImageData(imageData, 0, 0);
                this.t.push(
                    BABYLON.Texture.LoadFromDataString(
                        'gunE',
                        _canvas.toDataURL(),
                        s,
                        false,
                        false,
                        true,
                        BABYLON.Texture.NEAREST_SAMPLINGMODE
                    )
                );
                resolve();
            };
        });
    }
}
