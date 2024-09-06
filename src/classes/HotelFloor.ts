import {Game, SCALE} from './Game';
// prettier-ignore
const cube = {
'atlas': 
   {"positions":[1.5,0.5,-0.5,1.5,1.5,-0.5,1.5,1.5,-1.5,1.5,0.5,-1.5,-0.5,0.5,-1.5,-0.5,1.5,-1.5,-1.5,1.5,-1.5,-1.5,0.5,-1.5,-1.5,0.5,0.5,-1.5,1.5,0.5,-1.5,1.5,1.5,-1.5,0.5,1.5,0.5,0.5,1.5,0.5,1.5,1.5,1.5,1.5,1.5,1.5,0.5,1.5,-0.5,-1.5,0.5,-1.5,-1.5,0.5,-1.5,-1.5,1.5,-0.5,-1.5,1.5,0.5,1.5,0.5,1.5,1.5,0.5,1.5,1.5,1.5,1.5,1.5,1.5,0.5,1.5,1.5,0.5,-1.5,1.5,0.5,-0.5,1.5,1.5,-0.5,1.5,1.5,-1.5,1.5,-1.5,-1.5,0.5,-1.5,-0.5,0.5,-1.5,-0.5,1.5,-1.5,-1.5,0.5,-1.5,-1.5,1.5,-1.5,-0.5,0.5,-1.5,0.5,0.5,-1.5,0.5,1.5,-1.5,-0.5,0.5,-1.5,0.5,1.5,-1.5,-0.5,1.5,-0.5,-1.5,-1.5,-0.5,-0.5,-1.5,-1.5,-0.5,-1.5,-1.5,-1.5,-1.5,1.5,-1.5,-0.5,1.5,-0.5,-0.5,1.5,-0.5,-1.5,1.5,-1.5,-1.5,1.5,-0.5,1.5,1.5,0.5,1.5,1.5,0.5,0.5,1.5,-0.5,1.5,1.5,-0.5,0.5,1.5,-1.5,1.5,1.5,-0.5,1.5,1.5,-1.5,1.5,1.5,-1.5,0.5,-1.5,-0.5,-1.5,-1.5,0.5,-1.5,-1.5,0.5,-0.5,-1.5,-0.5,-1.5,-1.5,-0.5,-0.5,-1.5,-0.5,-0.5,-1.5,0.5,-0.5,-1.5,0.5,0.5,-1.5,-0.5,-0.5,-1.5,0.5,0.5,-1.5,-0.5,0.5,-1.5,-1.5,-1.5,-1.5,-0.5,-1.5,-1.5,-0.5,-0.5,-1.5,-1.5,-1.5,-1.5,-0.5,-0.5,-1.5,-1.5,-0.5,-1.5,-1.5,-0.5,-1.5,-0.5,-0.5,-1.5,-0.5,0.5,-1.5,-1.5,-0.5,-1.5,-0.5,0.5,-1.5,-1.5,0.5,0.5,1.5,-1.5,1.5,1.5,-1.5,1.5,1.5,-0.5,1.5,1.5,-0.5,0.5,1.5,-0.5,0.5,1.5,-0.5,1.5,1.5,-0.5,1.5,1.5,0.5,0.5,1.5,-0.5,1.5,1.5,0.5,0.5,1.5,0.5,-0.5,-1.5,-1.5,-1.5,-1.5,-1.5,-1.5,-1.5,-0.5,-0.5,-1.5,-1.5,-0.5,-1.5,-0.5,-1.5,0.5,-1.5,-1.5,1.5,-1.5,-1.5,1.5,-0.5,-1.5,0.5,-1.5,-1.5,0.5,-0.5,-1.5,0.5,-0.5,-1.5,1.5,-0.5,-1.5,1.5,0.5,-1.5,0.5,-0.5,-1.5,1.5,0.5,-1.5,0.5,0.5,1.5,0.5,1.5,1.5,1.5,1.5,1.5,1.5,0.5,1.5,0.5,1.5,1.5,-1.5,-0.5,0.5,-1.5,-0.5,0.5,-1.5,0.5,1.5,-1.5,-0.5,1.5,-1.5,0.5,1.5,-1.5,-1.5,0.5,-1.5,-1.5,1.5,-1.5,-1.5,1.5,-1.5,-0.5,-0.5,-1.5,-1.5,-1.5,1.5,-0.5,-0.5,1.5,-0.5,-0.5,1.5,0.5,-1.5,1.5,0.5,-0.5,1.5,-0.5,0.5,1.5,-0.5,0.5,1.5,0.5,-0.5,1.5,-0.5,0.5,1.5,0.5,-0.5,1.5,0.5,-1.5,1.5,-1.5,-0.5,1.5,-1.5,-0.5,1.5,-0.5,-0.5,1.5,-0.5,-1.5,1.5,-0.5,-0.5,1.5,-1.5,0.5,1.5,-1.5,0.5,1.5,-0.5,-0.5,1.5,-1.5,0.5,1.5,-0.5,-0.5,1.5,-0.5,1.5,-0.5,-1.5,1.5,0.5,-1.5,0.5,0.5,-1.5,1.5,-0.5,-1.5,0.5,-0.5,-1.5,1.5,-1.5,-1.5,1.5,-0.5,-1.5,0.5,-1.5,-1.5,0.5,-1.5,-1.5,0.5,-1.5,-1.5,-1.5,-0.5,1.5,-1.5,0.5,1.5,-0.5,0.5,1.5,-0.5,-0.5,1.5,-1.5,-1.5,1.5,-0.5,-1.5,1.5,-0.5,-1.5,1.5,-0.5,-1.5,1.5,-1.5,1.5,0.5,-0.5,1.5,0.5,-0.5,1.5,1.5,-1.5,1.5,0.5,-1.5,1.5,1.5,-0.5,1.5,0.5,0.5,1.5,0.5,0.5,1.5,1.5,-0.5,1.5,0.5,0.5,1.5,1.5,-0.5,1.5,1.5,1.5,-1.5,0.5,0.5,-1.5,1.5,1.5,-1.5,0.5,0.5,-1.5,1.5,1.5,-1.5,1.5,0.5,-1.5,1.5,-1.5,1.5,1.5,-0.5,1.5,1.5,1.5,0.5,-1.5,1.5,1.5,-1.5,0.5,1.5,-1.5,1.5,0.5,-1.5],"uvs":[0.625,0.625,0.625,0.875,0.875,0.875,0.875,0.625,0.625,0.625,0.625,0.875,0.875,0.875,0.875,0.625,0.25,0.75,0.25,1,0,1,0,0.75,0.375,0.625,0.375,0.875,0.125,0.875,0.125,0.625,0.625,0.375,0.875,0.375,0.875,0.125,0.625,0.125,0.75,1,0.5,1,0.5,0.75,0.5,0.75,0.75,0.75,0.375,0.125,0.375,0.375,0.125,0.375,0.125,0.125,0.5,0.75,0.5,1,0.25,1,0.5,0.75,0.25,0.75,0.25,0.75,0.25,1,0,1,0.25,0.75,0,1,0,0.75,0.625,0.125,0.625,0.375,0.875,0.375,0.875,0.125,0.625,0.125,0.625,0.375,0.875,0.375,0.875,0.125,0.125,0.375,0.125,0.625,0.375,0.625,0.125,0.375,0.375,0.375,0.125,0.125,0.125,0.375,0.125,0.125,0.375,0.125,0.25,0.75,0.25,1,0,1,0.25,0.75,0,0.75,0.25,0.75,0.25,1,0,1,0.25,0.75,0,1,0,0.75,0.5,0.75,0.5,1,0.25,1,0.5,0.75,0.25,1,0.25,0.75,0.5,0.75,0.5,1,0.25,1,0.5,0.75,0.25,1,0.25,0.75,0.75,1,0.5,1,0.5,0.75,0.5,0.75,0.75,0.75,0.75,1,0.5,1,0.5,0.75,0.75,1,0.5,0.75,0.75,0.75,0.625,0.875,0.875,0.875,0.875,0.625,0.625,0.875,0.625,0.625,0.25,0.75,0.25,1,0,1,0.25,0.75,0,0.75,0.25,0.75,0.25,1,0,1,0.25,0.75,0,1,0,0.75,0.125,0.625,0.125,0.875,0.375,0.875,0.125,0.625,0.125,0.625,0.375,0.625,0.375,0.375,0.125,0.625,0.125,0.375,0.125,0.875,0.375,0.875,0.125,0.875,0.125,0.625,0.625,0.875,0.75,1,0.5,1,0.5,0.75,0.75,0.75,0.75,1,0.5,1,0.5,0.75,0.75,1,0.5,0.75,0.75,0.75,0.75,1,0.5,1,0.5,0.75,0.5,0.75,0.75,0.75,0.75,1,0.5,1,0.5,0.75,0.75,1,0.5,0.75,0.75,0.75,0.125,0.375,0.125,0.625,0.375,0.625,0.125,0.375,0.375,0.375,0.125,0.125,0.125,0.375,0.375,0.125,0.375,0.125,0.375,0.125,0.875,0.375,0.875,0.625,0.625,0.625,0.625,0.375,0.875,0.125,0.625,0.125,0.625,0.125,0.625,0.125,0.75,1,0.5,1,0.5,0.75,0.75,1,0.75,0.75,0.75,1,0.5,1,0.5,0.75,0.75,1,0.5,0.75,0.75,0.75,0.125,0.375,0.375,0.125,0.125,0.375,0.375,0.125,0.125,0.125,0.375,0.125,0.875,0.875,0.625,0.875,0.125,0.625,0.125,0.875,0.375,0.875,0.125,0.625],"indices":[0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,23,24,25,26,27,25,27,28,26,12,15,26,15,27,29,30,31,32,31,33,34,35,36,37,38,39,40,41,42,40,42,43,41,4,7,41,7,42,44,45,46,44,46,47,45,0,3,45,3,46,48,49,50,51,50,52,52,50,0,52,0,45,53,54,52,55,52,56,56,52,45,56,45,44,57,58,59,60,59,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,80,83,84,85,86,87,88,89,90,91,92,93,94,93,95,95,93,17,95,17,16,96,97,98,99,98,100,101,102,103,104,105,106,107,108,109,110,109,50,50,109,1,50,1,0,111,112,113,114,113,115,112,95,16,112,16,113,116,117,112,118,112,119,117,120,95,117,95,112,121,122,123,121,123,124,125,126,127,128,129,130,131,132,133,131,134,135,136,137,138,139,140,141,142,143,144,145,144,146,146,144,4,146,4,41,147,148,146,147,146,149,150,146,41,151,41,40,152,153,154,152,154,155,155,154,12,155,12,26,156,152,155,156,155,157,158,155,26,159,26,25,160,161,162,163,162,164,165,166,167,168,169,170,171,113,172,173,174,175,113,16,19,113,19,176,153,177,178,153,178,154,154,178,13,154,13,12,179,180,181,182,181,144,144,181,5,144,5,4]}};

export class HotelFloor {
    private _scene: BABYLON.Scene;
    private _grid: string[][];
    private _params: {width: number; height: number};
    private _game: Game;
    private _baseCube!: BABYLON.Mesh;

    constructor(game: Game, scene: BABYLON.Scene, params: {width: number; height: number}) {
        this._scene = scene;
        this._params = params;
        this._game = game;
        this._grid = this._createGrid(params.width, params.height);

        this._createBaseMeshes();
        this._generateMaze();
        this._createMeshesFromGrid();

        //     this._testMesh();
    }

    private _testMesh() {
        var customMesh = new BABYLON.Mesh('custom', this._scene);

        var vertexData = new BABYLON.VertexData();

        vertexData.positions = cube.atlas.positions;
        vertexData.indices = cube.atlas.indices;
        vertexData.uvs = cube.atlas.uvs;

        vertexData.applyToMesh(customMesh);
        customMesh.position.y = 10;
    }

    private _getTextureCoordinates(row, col) {
        const _atlasSize = 4; // 4 by 4 grid
        const _cellSize = 1 / _atlasSize; // Each cell's width and height in UV coordinates

        const u1 = col * _cellSize;
        const v1 = row * _cellSize;
        const u2 = u1 + _cellSize;
        const v2 = v1 + _cellSize;

        return new BABYLON.Vector4(u1, v1, u2, v2);
    }

    private _createBaseMeshes() {
        // // Create a base cube to clone for walls
        // const faceUV = new Array(6);
        // for (let i = 0; i < 6; i++) {
        //     faceUV[i] = new BABYLON.Vector4(0.0, 0.75, 0.25, 1);
        // }
        // faceUV[1] = new BABYLON.Vector4(0.0, 0.5, 0.25, 0.75);
        // faceUV[4] = this._getTextureCoordinates(3, 2); // floor
        // faceUV[5] = new BABYLON.Vector4(0.0, 0.0, 0.0, 0.0); // ceiling
        this._baseCube = new BABYLON.Mesh('custom', this._scene);

        var vertexData = new BABYLON.VertexData();

        vertexData.positions = cube.atlas.positions;
        vertexData.indices = cube.atlas.indices;
        vertexData.uvs = cube.atlas.uvs;

        vertexData.applyToMesh(this._baseCube);
        //this._baseCube = BABYLON.MeshBuilder.CreateBox('myCube', {size: 3, faceUV: faceUV}, this._scene);
        var cubeMat = new BABYLON.StandardMaterial('cubeMat', this._scene);
        this._baseCube.position.y = -500;
        cubeMat.diffuseTexture = this._game.textures.t[0];
        this._baseCube.material = cubeMat;
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
                if (this._grid[x][y] === 'wall') {
                    this._createWallInstance(x * SCALE, y * SCALE);
                }
            }
        }
        // add a ring of walls around the maze
        for (let x = 0; x < this._params.width; x++) {
            this._createWallInstance(x * SCALE, -SCALE);
            this._createWallInstance(x * SCALE, this._params.height * SCALE);
        }
        for (let x = 0; x < this._params.height; x++) {
            this._createWallInstance(-SCALE, x * SCALE);
            this._createWallInstance(SCALE * this._params.width, x * SCALE);
        }
    }
    private _createWallInstance(x: number, y: number) {
        let c = this._baseCube.createInstance(`wall-${x}-${y}`);
        c.position.set(x, 1.5, y);
        c.rotate(BABYLON.Axis.Y, Math.PI * ~~(Math.random() * 4));
    }

    private _createCorridor(x: number, y: number) {
        let c = this._baseCube.createInstance(`floor-${x}-${y}`);
        c.position.set(x, -1.5, y);
        // const corridor = BABYLON.MeshBuilder.CreateBox(
        //     `corridor-${x}-${y}`,
        //     {height: 0.1, width: SCALE, depth: SCALE},
        //     this._scene
        // );
        // corridor.position = new BABYLON.Vector3(x, -0.05, y);
        // corridor.material = new BABYLON.StandardMaterial(`corridorMat-${x}-${y}`, this._scene);
        // (corridor.material as BABYLON.StandardMaterial).diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
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
