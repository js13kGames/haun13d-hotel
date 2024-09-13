export enum SFX {
    SHOOT = 0,
    HIT_GHOST = 1,
    GAME_OVER = 2,
    WIN = 3,
}

const t = (i, n) => (n - i) / n;
export class Soundfx {
    private _init: boolean = false;
    private _sounds: any[] = [];
    private _a!: AudioContext;

    _initAudio() {
        if (this._init) return;
        this._init = true;
        this._a = new AudioContext();
        this._createSound(this._generateShoot);
        this._createSound(this._generateHitghost);
        this._createSound(this._generateGameOver);
        this._createSound(this._generateWin);
    }

    private _createSound(func) {
        let hitBuffer = this._a.createBuffer(1, 96e3, 48e3);
        const hitBufferData = hitBuffer.getChannelData(0);
        // @ts-ignore
        for (let i = 96e3; i--; ) hitBufferData[i] = func(i);
        this._sounds.push(hitBuffer);
    }

    // Function to play a sound buffer
    _play(i: number) {
        // Create a buffer source node
        const bufferSource = this._a.createBufferSource();

        // Set the buffer to the one we created
        bufferSource.buffer = this._sounds[i];

        // Connect the buffer source to the audio context destination (speakers)
        bufferSource.connect(this._a.destination);

        // Start playing the buffer source
        bufferSource.start();
    }

    private _generateShoot = (i) => {
        var n = 2e4;
        if (i > n) return null;
        var q = t(i, n);
        return Math.pow(i * 500000, 0.3) & 33 ? q : -q;
    };

    private _generateHitghost = (i) => 2 * (Math.random() - 0.5) * Math.exp(-i / 5000);

    private _generateGameOver = (i) => {
        var n = 11e4;
        if (i > n) return null;
        var q = t(i, n);
        return Math.sin(i * 0.001 * Math.sin(0.009 * i + Math.sin(i / 200)) + Math.sin(i / 100)) * q * q;
    };

    private _generateWin = (i) => {
        var notes = [0, 0, 4, 0, 12, 7, 4, 12];
        var n = 3.5e4;
        if (i > n) return null;
        var idx = ((notes.length * i) / n) | 0;
        var note = notes[idx];
        if (note === undefined) return 0;
        var r = Math.pow(2, note / 12) * 0.8;
        var q = t((i * notes.length) % n, n);
        return (i * r) & 64 ? q : -q;
    };
}
