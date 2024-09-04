const SCALE = 3;

//#ifdef DEBUG
new EventSource('/esbuild').addEventListener('change', () => location.reload());
//#endif

class HotelFloor {
    private _scene: BABYLON.Scene;
    private _grid: string[][];
    private _params: {width: number; height: number};

    constructor(scene: BABYLON.Scene, params: {width: number; height: number}) {
        this._scene = scene;
        this._params = params;
        this._grid = this._createGrid(params.width, params.height);
        this._generateMaze();
        this._createMeshesFromGrid();
    }

    // Create an empty grid filled with walls
    private _createGrid(width: number, height: number): string[][] {
        let grid: string[][] = [];
        for (let x = 0; x < width; x++) {
            let row: string[] = [];
            for (let y = 0; y < height; y++) {
                row.push('wall');
            }
            grid.push(row);
        }
        return grid;
    }

    // Generate a maze using recursive backtracking
    private _generateMaze() {
        const {width, height} = this._params;

        // Start the maze generation from the top-left corner
        this._carvePassagesFrom(0, 0);

        // Place start and end points
        this._grid[0][0] = 'start';
        this._grid[width - 1][height - 1] = 'end';
    }

    private _carvePassagesFrom(cx: number, cy: number) {
        const directions = [
            [0, 1], // North
            [1, 0], // East
            [0, -1], // South
            [-1, 0], // West
        ];

        // Shuffle directions to ensure a random maze
        this._shuffleArray(directions);

        for (const direction of directions) {
            const nx = cx + direction[0] * 2;
            const ny = cy + direction[1] * 2;

            if (this._isInBounds(nx, ny) && this._grid[nx][ny] === 'wall') {
                this._grid[nx][ny] = 'corridor';
                this._grid[cx + direction[0]][cy + direction[1]] = 'corridor';
                this._carvePassagesFrom(nx, ny);
            }
        }
    }

    private _isInBounds(x: number, y: number): boolean {
        const {width, height} = this._params;
        return x >= 0 && x < width && y >= 0 && y < height;
    }

    private _shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Convert the grid into BabylonJS meshes
    private _createMeshesFromGrid() {
        for (let x = 0; x < this._grid.length; x++) {
            for (let y = 0; y < this._grid[x].length; y++) {
                if (this._grid[x][y] === 'corridor' || this._grid[x][y] === 'start' || this._grid[x][y] === 'end') {
                    this._createCorridor(x * SCALE, y * SCALE);
                }
                if (this._grid[x][y] === 'start') {
                    this._createStart(x * SCALE, y * SCALE);
                }
                if (this._grid[x][y] === 'end') {
                    this._createEnd(x * SCALE, y * SCALE);
                }
            }
        }
    }

    private _createCorridor(x: number, y: number) {
        const corridor = BABYLON.MeshBuilder.CreateBox(
            `corridor-${x}-${y}`,
            {height: 0.1, width: SCALE, depth: SCALE},
            this._scene
        );
        corridor.position = new BABYLON.Vector3(x, -0.05, y);
        corridor.material = new BABYLON.StandardMaterial(`corridorMat-${x}-${y}`, this._scene);
        (corridor.material as BABYLON.StandardMaterial).diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    }

    private _createStart(x: number, y: number) {
        const start = BABYLON.MeshBuilder.CreateBox(
            `start-${x}-${y}`,
            {height: 0.1, width: SCALE, depth: SCALE},
            this._scene
        );
        start.position = new BABYLON.Vector3(x, -0.05, y);
        start.material = new BABYLON.StandardMaterial(`startMat-${x}-${y}`, this._scene);
        (start.material as BABYLON.StandardMaterial).diffuseColor = new BABYLON.Color3(0, 1, 0);
    }

    private _createEnd(x: number, y: number) {
        const end = BABYLON.MeshBuilder.CreateBox(
            `end-${x}-${y}`,
            {height: 0.1, width: SCALE, depth: SCALE},
            this._scene
        );
        end.position = new BABYLON.Vector3(x, -0.05, y);
        end.material = new BABYLON.StandardMaterial(`endMat-${x}-${y}`, this._scene);
        (end.material as BABYLON.StandardMaterial).diffuseColor = new BABYLON.Color3(1, 0, 0);
    }
}

export class Game {
    scene: BABYLON.Scene;
    engine: BABYLON.Engine;

    constructor() {
        const canvas = document.getElementById('c') as HTMLCanvasElement;
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);

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
        //#endif

        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), this.scene);

        const hotelFloor = new HotelFloor(this.scene, {width: 13, height: 13});
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
