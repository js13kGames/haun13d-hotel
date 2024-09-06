import {HotelFloor} from './HotelFloor';
import {Textures} from './Textures';

export const SCALE = 3;

//#ifdef DEBUG
new EventSource('/esbuild').addEventListener('change', () => location.reload());
//#endif

export class Game {
    scene: BABYLON.Scene;
    engine: BABYLON.Engine;
    textures: Textures;
    constructor() {
        const canvas = document.getElementById('c') as HTMLCanvasElement;
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color4();

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
                let l = new BABYLON.PointLight('userlight', new BABYLON.Vector3(0, 0, 0), this.scene);
                l.range = 15;
                l.parent = xrHelper.baseExperience.camera;
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
                xrHelper.baseExperience.sessionManager.onXRFrameObservable.add(() => {
                    if (xrHelper.baseExperience.state === BABYLON.WebXRState.IN_XR) {
                        //triangle.rotation.y = (0.5 + movementFeature..movementDirection.toEulerAngles().y);
                        //triangle.position.set(xrHelper.input.xrCamera.position.x, 0.5, xrHelper.input.xrCamera.position.z);
                    }
                });
            });
    }
}
