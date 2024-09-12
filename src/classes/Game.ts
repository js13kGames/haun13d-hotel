import {_GhostMeshData} from './Ghost';
import {_GunMeshData} from './Gun';
import {HotelFloor} from './HotelFloor';
import {AI} from './secs/components/AI';
import {ControllerInput, handedness} from './secs/components/ControllerInput';
import {GhostEntity} from './secs/components/GhostEntity';
import {Gun} from './secs/components/Gun';
import {MeshEntity} from './secs/components/MeshEntity';
import {Scale} from './secs/components/Scale';
import {Secs} from './secs/secs';
import {InputSystem} from './secs/systems/InputSystem';
import {Textures} from './Textures';

export const SCALE = 3,
    _LEVELWIDTH = 13,
    _LEVELHEIGHT = 13;

enum GameState {
    LOADING,
    PREGAME,
    PLAYING,
    PAUSED,
    GAME_OVER,
    WIN,
}

//#ifdef DEBUG
new EventSource('/esbuild').addEventListener('change', () => location.reload());
//#endif

export class Game {
    static instance: Game;
    scene!: BABYLON.Scene;
    engine!: BABYLON.Engine;
    textures!: Textures;
    _hotelFloor!: HotelFloor;
    _playerGridPos!: {x: number; y: number};
    _secs: Secs = new Secs();

    private _inputS = new InputSystem();

    private _state: GameState = GameState.LOADING;
    private _ghosts: BABYLON.AbstractMesh[] = [];
    c!: BABYLON.FreeCamera;
    _hud!: BABYLON.Mesh;
    _gun!: BABYLON.Mesh;
    private _underAttack: boolean = false;
    private _flashlight?: BABYLON.SpotLight;
    _tonemapLeftXR?: BABYLON.TonemapPostProcess;
    _tonemapRightXR?: BABYLON.TonemapPostProcess;
    _currentFade: number = 0;
    _fadeState: number = 0;
    _xrHelper!: BABYLON.WebXRDefaultExperience;
    private _titleScreen!: BABYLON.Node;
    private _gameOverScreen!: BABYLON.Node;
    private _resetButton!: HTMLDivElement;
    private _winScreen!: BABYLON.Node;
    constructor() {
        this._resetButton = document.getElementById('r')! as HTMLDivElement;
        this._resetButton?.addEventListener('click', () => {
            window.location.reload();
        });

        Game.instance = this;
        this._initialize().then(() => {
            this._hotelFloor = new HotelFloor(this, this.scene, {width: _LEVELWIDTH, height: _LEVELHEIGHT});

            this.engine.runRenderLoop(this._render);

            window.addEventListener('resize', () => {
                this.engine.resize();
            });

            this._initializeXR().catch((e) => console.error(e));
            this._titleScreen = this._createTitle('HAUN13T HOTEL', '   Switch to VR to play', false);
            this._titleScreen.setEnabled(true);
            this._gameOverScreen = this._createTitle('   GAME OV3R', '', false);
            this._winScreen = this._createTitle('     YOU WON !', 'You escaped the Haun13t Hotel', false);
            this._state = GameState.PREGAME;
        });
    }

    private _render = () => {
        let _dt = this.engine.getDeltaTime();

        this._secs.match(ControllerInput).map((e) => this._inputS._controllers(e, _dt));
        this._secs.match(GhostEntity).map((e) => e.get(GhostEntity).update(_dt, e));
        this._secs.match(Gun).map((e) => e.get(Gun).update(_dt, e));
        this._secs.match(Scale).map((e) => e.get(Scale).update(_dt, e));
        switch (this._state) {
            case GameState.LOADING:
                break;
            case GameState.PLAYING:
                if (this._underAttack) break;
                this._playerGridPos = {
                    x: ~~((this.c.position.x + 0.5) / SCALE),
                    y: ~~((this.c.position.z + 0.5) / SCALE),
                };
                if (this._playerGridPos.x == _LEVELWIDTH - 1 && this._playerGridPos.y == _LEVELWIDTH - 1) {
                    // player is standing on the target.
                    if (this._ghosts.length === 0) {
                        // all ghosts are dead
                        this._state = GameState.WIN;
                    }
                }

                this._secs.match(AI)?.map((e) => e.get(AI).update(_dt, e));
                break;
            case GameState.GAME_OVER:
                this._fadeState = -2;
                setTimeout(async () => {
                    this._flashlight?.dispose();
                    this._xrHelper.enterExitUI.overlay.remove();
                    await this._xrHelper.baseExperience.exitXRAsync();
                    // @ts-ignore
                    this._resetButton.style.display = 'block';
                    this._gameOverScreen!.setEnabled(true);
                }, 2000);
                break;
            case GameState.WIN:
                this._fadeState = -0.5;
                setTimeout(async () => {
                    this._flashlight?.dispose();
                    this._xrHelper.enterExitUI.overlay.remove();
                    await this._xrHelper.baseExperience.exitXRAsync();

                    // @ts-ignore
                    this._resetButton.style.display = 'block';
                    this._winScreen.setEnabled(true);
                }, 3000);
                break;
        }

        this.scene.render();
    };

    private async _initialize() {
        const canvas = document.getElementById('c') as HTMLCanvasElement;
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);

        this._secs._registerSystems([this._inputS]);

        this.scene.clearColor = new BABYLON.Color4();
        this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

        this.textures = new Textures();
        await this.textures.load(this.scene);

        // this._hud = BABYLON.MeshBuilder.CreatePlane('leveldesc', {size: 0.5});
        // this._hud.renderingGroupId = 1;
        // this._hud.position = new BABYLON.Vector3(0, 0, 1);
        // this._hud.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        // this._hud.material = new BABYLON.StandardMaterial('hudmat');
        // this._createText(this._hud, 'ld', '36px monospace', 'Kill all 13 ghosts\nand escape!', '#FFFFFF');
        //#ifdef DEBUG
        // hide/show the Inspector
        window.addEventListener('keydown', (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.code === 'KeyI') {
                if (this.scene.debugLayer.isVisible()) {
                    this.scene.debugLayer.hide();
                } else {
                    this.scene.debugLayer.show();
                }
            }
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.code === 'KeyL') {
                new BABYLON.HemisphericLight('debug light', new BABYLON.Vector3(7.5, 2.5, 7.5), this.scene);
            }
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.code === 'KeyW') {
                this._state = GameState.WIN;
            }
        });
        //#endif

        const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 1.7, 0), this.scene);

        //#ifdef DEBUG
        // camera.position = new BABYLON.Vector3(72.18, 69.69, 20.79);
        // camera.target = new BABYLON.Vector3(71.6, 68.88, 20.78);
        // enable controls for debugging
        camera.inputs.addKeyboard();
        camera.attachControl(canvas, true);
        this.c = camera;
        //camera.applyGravity = true;
        //camera.checkCollisions = true;
        //#endif
    }

    private async _initializeXR() {
        this._xrHelper = await this.scene.createDefaultXRExperienceAsync({
            disableNearInteraction: true,
            disablePointerSelection: true,
            disableTeleportation: true,
            disableHandTracking: true,
            inputOptions: {
                doNotLoadControllerMeshes: true,
            },
        });

        const xrRoot = new BABYLON.TransformNode('xrRoot', this.scene);
        this._xrHelper.baseExperience.camera.parent = xrRoot;
        this._xrHelper.baseExperience.camera.applyGravity = true;
        this._xrHelper.baseExperience.camera.checkCollisions = true;

        // create flashlight
        const flM = BABYLON.CreateCylinder('fl', {height: 0.15, diameterTop: 0.02, diameterBottom: 0.03});
        this._flashlight = new BABYLON.SpotLight(
            'fl',
            new BABYLON.Vector3(0, -0.1, 0),
            new BABYLON.Vector3(0, -1, 0),
            Math.PI / 2,
            10,
            this.scene
        );
        this._flashlight.diffuse = new BABYLON.Color3(1, 1, 1);
        this._flashlight.specular = new BABYLON.Color3(1, 1, 1);
        this._flashlight.range = 25;
        this._flashlight.shadowEnabled = true;
        this._flashlight.parent = flM;
        flM.rotation.x = -Math.PI / 2;
        const d = new BABYLON.TransformNode('d', this.scene);
        flM.parent = d;

        // @ts-ignore - incorrect type (d), but for the jam it's fine
        this._secs._createEntity([new ControllerInput(handedness.LEFT), new MeshEntity(d)]);

        // create gun
        this._gun = new BABYLON.Mesh('gun', this.scene);
        this._gun.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
        var vertexData = new BABYLON.VertexData();
        vertexData.positions = _GunMeshData.positions;
        vertexData.indices = _GunMeshData.indices;
        vertexData.uvs = _GunMeshData.uvs;
        vertexData.applyToMesh(this._gun);
        const material = new BABYLON.StandardMaterial('gunmat', this.scene);
        material.diffuseTexture = this.textures.t[10];
        material.emissiveTexture = this.textures.t[11];
        material.specularColor = new BABYLON.Color3(0, 0, 0);
        this._gun.material = material;

        this._secs._createEntity([
            new ControllerInput(handedness.RIGHT),
            new MeshEntity(this._gun),
            new Gun(this._shoot),
        ]);

        this._xrHelper.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT, 'latest', {
            xrInput: this._xrHelper.input,
            movementSpeed: 0.1,
            rotationEnabled: false,
        });

        this._xrHelper.baseExperience.onStateChangedObservable.add((state) => {
            switch (state) {
                case BABYLON.WebXRState.IN_XR:
                    this._titleScreen!.setEnabled(false);
                    this._spawnGhosts();
                    this._state = GameState.PLAYING;
                    this.c = this._xrHelper.baseExperience.camera!;
                    //this._hud.parent = this.c;
                    if (!this._tonemapLeftXR) {
                        this._tonemapLeftXR = new BABYLON.TonemapPostProcess(
                            '',
                            BABYLON.TonemappingOperator.Reinhard,
                            0,
                            this._xrHelper.baseExperience.camera.leftCamera
                        );
                        this._tonemapRightXR = new BABYLON.TonemapPostProcess(
                            '',
                            BABYLON.TonemappingOperator.Reinhard,
                            0,
                            this._xrHelper.baseExperience.camera.rightCamera
                        );
                    }
                    if (this._currentFade < 1) {
                        this._fadeState = 1;
                    }
                    break;
                case BABYLON.WebXRState.NOT_IN_XR:
                    this._state = GameState.PAUSED;
                    break;
                case BABYLON.WebXRState.EXITING_XR:
                    break;
                case BABYLON.WebXRState.ENTERING_XR:
                    break;
            }
        });

        this.scene.onBeforeRenderObservable.add(() => {
            this._currentFade += 0.01 * this._fadeState;
            if (this._tonemapLeftXR) this._tonemapLeftXR.exposureAdjustment = this._currentFade;
            //if (this.tmC) this.tmC.exposureAdjustment = this._currentFade;
            if (this._tonemapRightXR) this._tonemapRightXR.exposureAdjustment = this._currentFade;
            if (this._currentFade >= 1.5 || this._currentFade < 0) {
                this._fadeState = 0;
            }
        });

        this._xrHelper.input.onControllerAddedObservable.add((_controller) => {
            this._inputS._xrControllers.push(_controller);
        });

        // xrHelper.baseExperience.sessionManager.onXRFrameObservable.add(() => {
        //     if (xrHelper.baseExperience.state === BABYLON.WebXRState.IN_XR) {
        //         //triangle.rotation.y = (0.5 + movementFeature..movementDirection.toEulerAngles().y);
        //         //triangle.position.set(xrHelper.input.xrCamera.position.x, 0.5, xrHelper.input.xrCamera.position.z);
        //     }
        // });
    }
    private _shoot = (position: BABYLON.Vector3, forward: BABYLON.Vector3) => {
        const _ray = new BABYLON.Ray(position, forward, 25);

        // Initialize closest hits
        let _closestWallHit!: BABYLON.PickingInfo | null;
        let _closestGhostHit!: BABYLON.PickingInfo | null;
        let _closestGhostIndex = -1;

        // Check walls
        _closestWallHit = _ray
            .intersectsMeshes(this._hotelFloor.w, false)
            .reduce((closest: BABYLON.PickingInfo | null, hit) => {
                return !closest || hit.distance < closest.distance ? hit : closest;
            }, null);

        // Check ghosts and determine closest hit
        this._ghosts.forEach((ghost, gi) => {
            const ghostHit = _ray.intersectsMesh(ghost, false);
            if (ghostHit.hit) {
                if (!_closestGhostHit || ghostHit.distance < _closestGhostHit.distance) {
                    _closestGhostHit = ghostHit;
                    _closestGhostIndex = gi;
                }
            }
        });

        // Determine final outcome based on closest hits
        if (_closestGhostHit && (!_closestWallHit || _closestGhostHit.distance < _closestWallHit.distance)) {
            _closestGhostHit.pickedMesh!.dispose();
            const ghostEntity = this._secs
                .match(GhostEntity)
                .find((e) => e.get(MeshEntity)._mesh === _closestGhostHit?.pickedMesh);
            if (ghostEntity) {
                this._ghosts.splice(_closestGhostIndex, 1);
                ghostEntity.kill();
                console.log(`Killed ghost, ${this._ghosts.length} remaining`);
            }
        }
        // else if (closestWallHit) {
        //     console.log('Hit wall');
        // }
    };
    private _attack = () => {
        if (this._underAttack) return;
        this._underAttack = true;
        const m = new BABYLON.Mesh('gameover');
        m.position = this.c.getFrontPosition(2);
        m.position.y = 0;
        const vertexData = new BABYLON.VertexData();
        vertexData.positions = [0, 0.5, 0, 0, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0, -0.5, -0.5, 0];
        vertexData.indices = [0, 1, 2, 0, 2, 3, 4, 5, 1, 4, 1, 0];
        vertexData.uvs = [1, 1, 1, 0, 0.83, 0, 0.83, 1, 0.83, 1, 0.83, 0];
        vertexData.applyToMesh(m);
        const material = new BABYLON.StandardMaterial('gameovermat');
        material.diffuseTexture = this.textures.t[9];
        material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        //material.specularColor = new BABYLON.Color3(0, 0, 0);
        material.diffuseTexture.hasAlpha = true;
        material.disableLighting = true;
        m.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        m.parent = this.c;
        m.material = material;
        m.renderingGroupId = 2;
        this._secs._createEntity([new Scale(0.5, 3, 1), new MeshEntity(m)]);
        setTimeout(() => {
            this._xrHelper.input.dispose();
            this._secs.match(ControllerInput).map((e) => e.kill());
            this._state = GameState.GAME_OVER;
            this._secs.match(GhostEntity).map((e) => e.kill());
        }, 500);
        this._secs.match(GhostEntity).map((e) => e.get(GhostEntity).dispose());
    };

    private _spawnGhosts() {
        const basemesh = new BABYLON.Mesh('ghost', this.scene);

        var vertexData = new BABYLON.VertexData();
        vertexData.positions = _GhostMeshData.positions;
        vertexData.indices = _GhostMeshData.indices;
        vertexData.uvs = _GhostMeshData.uvs;
        vertexData.applyToMesh(basemesh);

        const material = new BABYLON.StandardMaterial('ghostmat', this.scene);
        material.diffuseTexture = this.textures.t[9];
        material.specularColor = new BABYLON.Color3(0, 0, 0);
        material.diffuseTexture.hasAlpha = true;
        basemesh.material = material;

        for (let i = 0; i < 13; i++) {
            let x, y;
            do {
                x = ~~(Math.random() * _LEVELWIDTH);
                y = ~~(Math.random() * _LEVELHEIGHT);
            } while (!this._hotelFloor._validPosition(x, y));

            // instantiate ghost mesh
            var ghost = basemesh.createInstance(`g${i}`);
            ghost.position.x = x * SCALE;
            ghost.position.z = y * SCALE;
            ghost.position.y = 1.5;
            ghost.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
            ghost.isPickable = true;
            this._secs._createEntity([new GhostEntity(), new MeshEntity(ghost), new AI(i, x, y, this._attack)]);
            this._ghosts.push(ghost);
        }
    }

    _createText(mesh, name, font, text, color) {
        const dt = new BABYLON.DynamicTexture(`dt${name}`, {width: 1200, height: 1200});
        const smat = new BABYLON.StandardMaterial(`mat${name}`);
        dt.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE);
        smat.diffuseTexture = dt;
        smat.emissiveTexture = dt;
        smat.specularColor = BABYLON.Color3.Black();
        mesh.material = smat;
        let t = text.split('\n');
        dt.drawText(t[0], null, 36, font, color, 'rgba(0,0,0,0)', true, true);
        if (t[1]) dt.drawText(t[1], null, 72, font, color, 'rgba(0,0,0,0)', true, true);
        dt.hasAlpha = true;
    }

    _createTitle(titleText: string, subtitle: string, xr: boolean) {
        var titlescreen = new BABYLON.Node('titleParent' + titleText);

        const pressTrigger = BABYLON.MeshBuilder.CreatePlane('PressTrigger' + titleText, {width: 3, height: 0.75});
        pressTrigger.parent = titlescreen;
        pressTrigger.position = new BABYLON.Vector3(0, 1.75, 2);
        //this.shadowS.add(pressTrigger);
        const pressTriggerTexture = new BABYLON.DynamicTexture('dynamic texture' + titleText, {
            width: 1200,
            height: 300,
        });
        const ctx = pressTriggerTexture.getContext();
        const pressTriggerMaterial = new BABYLON.StandardMaterial('Mat' + titleText);
        pressTriggerMaterial.diffuseTexture = pressTriggerTexture;
        pressTriggerMaterial.emissiveTexture = pressTriggerTexture;
        pressTriggerMaterial.specularColor = BABYLON.Color3.Black();
        pressTrigger.material = pressTriggerMaterial;
        const font = 'bold 44px monospace';

        pressTriggerTexture.drawText(
            subtitle, //xr ? 'Press trigger to start' : 'Switch to VR to play',
            300,
            215,
            font,
            '#7c8898',
            'rgba(0,0,0,0)',
            true,
            true
        );

        pressTriggerTexture.hasAlpha = true;

        ctx.font = "100px 'Montserrat', Arial, sans-serif";
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 16;
        ctx.strokeText(titleText, 210, 128);
        ctx.fillStyle = '#4FF';
        ctx.fillText(titleText, 215, 123);
        ctx.shadowColor = '#088';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = -4;
        ctx.shadowOffsetY = 4;
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#8FF';
        ctx.strokeText(titleText, 215, 123);
        pressTriggerTexture.update();
        titlescreen.setEnabled(false);
        return titlescreen;
    }
}
