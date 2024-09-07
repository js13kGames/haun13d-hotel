import {HotelFloor} from './HotelFloor';
import {ControllerInput, handedness} from './secs/components/ControllerInput';
import {MeshEntity} from './secs/components/MeshEntity';
import {Secs} from './secs/secs';
import {InputSystem} from './secs/systems/InputSystem';
import {Textures} from './Textures';

export const SCALE = 3;

//#ifdef DEBUG
new EventSource('/esbuild').addEventListener('change', () => location.reload());
//#endif

export class Game {
    scene: BABYLON.Scene;
    engine: BABYLON.Engine;
    textures: Textures;
    private _inputS = new InputSystem();
    private _secs: Secs = new Secs();

    constructor() {
        const canvas = document.getElementById('c') as HTMLCanvasElement;
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);

        this._secs.registerSystems([this._inputS]);

        this.scene.clearColor = new BABYLON.Color4();
        this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        this.textures = new Textures(this.scene);
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
        camera.applyGravity = true;
        camera.checkCollisions = true;
        new BABYLON.HemisphericLight('debug light', new BABYLON.Vector3(7.5, 2.5, 7.5), this.scene);
        //#endif

        // for (let i = 0; i < 3; i++) {
        //     let l = new BABYLON.PointLight(
        //         'light',
        //         new BABYLON.Vector3(~~(Math.random() * 13) * SCALE, 2.5, ~~(Math.random() * 13) * SCALE),
        //         this.scene
        //     );
        //     l.range = 15;
        //     //l.shadowEnabled = true;
        // }

        const hotelFloor = new HotelFloor(this, this.scene, {width: 13, height: 13});
        this.engine.runRenderLoop(() => {
            let dt = this.engine.getDeltaTime();
            this._secs.match(ControllerInput).map((e) => this._inputS.controllers(e, dt));

            // switch (this.state) {
            //     case 2:
            //         //secs.match(AIController).map(e => e.get(AIController).update(dt, e));
            //         break;
            //     case 1:
            //         break;
            //     case 3:
            //         break;
            // }

            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        const xrHelper = this.scene
            .createDefaultXRExperienceAsync({
                disableNearInteraction: true,
                disablePointerSelection: true,
                disableTeleportation: true,
                disableHandTracking: true,
                inputOptions: {
                    doNotLoadControllerMeshes: true,
                },
            })
            .then((xrHelper) => {
                const xrRoot = new BABYLON.TransformNode('xrRoot', this.scene);
                xrHelper.baseExperience.camera.parent = xrRoot;
                xrHelper.baseExperience.camera.applyGravity = true;
                // let l = new BABYLON.PointLight('userlight', new BABYLON.Vector3(0, 0, 0), this.scene);
                // l.range = 15;
                // l.specular = new BABYLON.Color3(0.2, 0.2, 0);
                // l.falloffType = BABYLON.Light.FALLOFF_PHYSICAL;
                // l.parent = xrHelper.baseExperience.camera;

                const fl = new BABYLON.SpotLight(
                    'light',
                    new BABYLON.Vector3(0, 0, 0),
                    new BABYLON.Vector3(0, 1, 0),
                    Math.PI / 2,
                    10,
                    this.scene
                );
                fl.diffuse = new BABYLON.Color3(1, 1, 1);
                fl.specular = new BABYLON.Color3(1, 1, 1);
                fl.range = 25;
                fl.shadowEnabled = true;

                var flM = BABYLON.CreateCylinder('fl', {height: 0.15, diameterTop: 0.03, diameterBottom: 0.02});
                fl.parent = flM;
                //flM.parent = this.controllerP;

                this._secs.createEntity([new ControllerInput(handedness.LEFT), new MeshEntity(flM)]);

                // xrHelper.baseExperience.featuresManager.enableFeature(
                //     BABYLON.WebXRFeatureName.WALKING_LOCOMOTION,
                //     'latest',
                //     {locomotionTarget: xrRoot}
                // );

                const movementFeature = xrHelper.baseExperience.featuresManager.enableFeature(
                    BABYLON.WebXRFeatureName.MOVEMENT,
                    'latest',
                    {
                        xrInput: xrHelper.input,
                        movementSpeed: 0.1,
                        rotationEnabled: false,
                        movementOrientationFollowsViewerPose: true, // default true
                    }
                );

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
            });
    }
}
