import {_GhostMeshData} from './Ghost';
import {_GunMeshData} from './Gun';
import {HotelFloor} from './HotelFloor';
import {ControllerInput, handedness} from './secs/components/ControllerInput';
import {GhostEntity} from './secs/components/GhostEntity';
import {MeshEntity} from './secs/components/MeshEntity';
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
}

//#ifdef DEBUG
new EventSource('/esbuild').addEventListener('change', () => location.reload());

//#endif

export class Game {
    scene!: BABYLON.Scene;
    engine!: BABYLON.Engine;
    textures!: Textures;

    private _inputS = new InputSystem();
    private _secs: Secs = new Secs();
    private _hotelFloor!: HotelFloor;
    private _state: GameState = GameState.LOADING;

    constructor() {
        this._initialize().then(() => {
            this._hotelFloor = new HotelFloor(this, this.scene, {width: _LEVELWIDTH, height: _LEVELHEIGHT});

            this.engine.runRenderLoop(this._render);

            window.addEventListener('resize', () => {
                this.engine.resize();
            });

            this._initializeXR().catch((e) => console.error(e));

            this._spawnGhosts();
            console.log('Game initialized');
        });
    }

    private _render = () => {
        let _dt = this.engine.getDeltaTime();
        this._secs.match(ControllerInput).map((e) => this._inputS.controllers(e, _dt));
        this._secs.match(GhostEntity).map((e) => e.get(GhostEntity).update(_dt, e));
        switch (this._state) {
            case GameState.LOADING:
                break;

            //         //secs.match(AIController).map(e => e.get(AIController).update(dt, e));
            //         break;
            //     case 1:
            //         break;
            //     case 3:
            //         break;
        }

        this.scene.render();
    };

    private async _initialize() {
        const canvas = document.getElementById('c') as HTMLCanvasElement;
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);

        this._secs.registerSystems([this._inputS]);

        this.scene.clearColor = new BABYLON.Color4();
        this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

        this.textures = new Textures();
        await this.textures.load(this.scene);

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
        });
        //#endif

        const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 1.7, 0), this.scene);

        //#ifdef DEBUG
        // enable controls for debugging
        camera.inputs.addKeyboard();
        camera.attachControl(canvas, true);
        //camera.applyGravity = true;
        //camera.checkCollisions = true;
        //new BABYLON.HemisphericLight('debug light', new BABYLON.Vector3(7.5, 2.5, 7.5), this.scene);
        //#endif
    }

    private async _initializeXR() {
        const xrHelper = await this.scene.createDefaultXRExperienceAsync({
            disableNearInteraction: true,
            disablePointerSelection: true,
            disableTeleportation: true,
            disableHandTracking: true,
            inputOptions: {
                doNotLoadControllerMeshes: true,
            },
        });

        const xrRoot = new BABYLON.TransformNode('xrRoot', this.scene);
        xrHelper.baseExperience.camera.parent = xrRoot;
        xrHelper.baseExperience.camera.applyGravity = true;
        xrHelper.baseExperience.camera.checkCollisions = true;
        // let l = new BABYLON.PointLight('userlight', new BABYLON.Vector3(0, 0, 0), this.scene);
        // l.range = 15;
        // l.specular = new BABYLON.Color3(0.2, 0.2, 0);
        // l.falloffType = BABYLON.Light.FALLOFF_PHYSICAL;
        // l.parent = xrHelper.baseExperience.camera;

        const flM = BABYLON.CreateCylinder('fl', {height: 0.15, diameterTop: 0.02, diameterBottom: 0.03});
        const fl = new BABYLON.SpotLight('fl', new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, -1, 0), Math.PI / 2, 10, this.scene);
        fl.diffuse = new BABYLON.Color3(1, 1, 1);
        fl.specular = new BABYLON.Color3(1, 1, 1);
        fl.range = 25;
        fl.shadowEnabled = true;
        fl.parent = flM;

        this._secs.createEntity([new ControllerInput(handedness.LEFT), new MeshEntity(flM)]);

        const gun = new BABYLON.Mesh('gun', this.scene);
        gun.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
        var vertexData = new BABYLON.VertexData();
        vertexData.positions = _GunMeshData.positions;
        vertexData.indices = _GunMeshData.indices;
        vertexData.uvs = _GunMeshData.uvs;
        vertexData.applyToMesh(gun);
        const material = new BABYLON.StandardMaterial('gunmat', this.scene);
        //material.emissiveTexture = this.textures.t[9];
        material.diffuseTexture = this.textures.t[10];
        material.emissiveTexture = this.textures.t[11];
        //material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        material.specularColor = new BABYLON.Color3(0, 0, 0);
        //material.disableLighting = true;
        gun.material = material;
        this._secs.createEntity([new ControllerInput(handedness.RIGHT), new MeshEntity(gun)]);
        // xrHelper.baseExperience.featuresManager.enableFeature(
        //     BABYLON.WebXRFeatureName.WALKING_LOCOMOTION,
        //     'latest',
        //     {locomotionTarget: xrRoot}
        // );

        xrHelper.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.MOVEMENT, 'latest', {
            xrInput: xrHelper.input,
            movementSpeed: 0.1,
            rotationEnabled: false,
            movementOrientationFollowsViewerPose: true, // default true
        });

        xrHelper.baseExperience.onStateChangedObservable.add((state) => {
            switch (state) {
                case BABYLON.WebXRState.IN_XR:
                    //this.camera = xrHelper.baseExperience.camera.leftCamera!;
                    break;
                case BABYLON.WebXRState.NOT_IN_XR:
                    break;
                case BABYLON.WebXRState.EXITING_XR:
                case BABYLON.WebXRState.ENTERING_XR:
                    break;
            }
        });

        xrHelper.input.onControllerAddedObservable.add((_controller) => {
            this._inputS.xrControllers.push(_controller);
        });

        xrHelper.baseExperience.sessionManager.onXRFrameObservable.add(() => {
            if (xrHelper.baseExperience.state === BABYLON.WebXRState.IN_XR) {
                //triangle.rotation.y = (0.5 + movementFeature..movementDirection.toEulerAngles().y);
                //triangle.position.set(xrHelper.input.xrCamera.position.x, 0.5, xrHelper.input.xrCamera.position.z);
            }
        });
    }

    private _spawnGhosts() {
        const basemesh = new BABYLON.Mesh('ghost', this.scene);

        var vertexData = new BABYLON.VertexData();
        vertexData.positions = _GhostMeshData.positions;
        vertexData.indices = _GhostMeshData.indices;
        vertexData.uvs = _GhostMeshData.uvs;
        vertexData.applyToMesh(basemesh);

        const material = new BABYLON.StandardMaterial('ghostmat', this.scene);
        //material.emissiveTexture = this.textures.t[9];
        material.diffuseTexture = this.textures.t[9];
        material.specularColor = new BABYLON.Color3(0, 0, 0);
        material.diffuseTexture.hasAlpha = true;
        //material.disableLighting = true;
        basemesh.material = material;
        // let l = basemesh.getVertexBuffer(BABYLON.VertexBuffer.UVKind);
        // basemesh.setVerticesBuffer([0, 0, 1, 1]);

        for (let i = 0; i < 13; i++) {
            let x, y;
            do {
                x = ~~(Math.random() * _LEVELWIDTH);
                y = ~~(Math.random() * _LEVELHEIGHT);
            } while (!this._hotelFloor._validPosition(x, y));

            console.log('Ghost at', x, y);

            // instantiate ghost mesh
            var ghost = basemesh.createInstance(`g${i}`);
            ghost.position.x = x * SCALE;
            ghost.position.z = y * SCALE;
            ghost.position.y = 1.5;
            ghost.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;

            this._secs.createEntity([new GhostEntity(), new MeshEntity(ghost)]);
        }
    }
}
