import {Game, SCALE} from './Game';
// prettier-ignore
const cube = {
'atlas': 
    {"positions":[1.5,0.5,-0.5,1.5,1.5,-0.5,1.5,1.5,-1.5,1.5,0.5,-1.5,-0.5,0.5,-1.5,-0.5,1.5,-1.5,-1.5,1.5,-1.5,-1.5,0.5,-1.5,-1.5,0.5,0.5,-1.5,1.5,0.5,-1.5,1.5,1.5,-1.5,0.5,1.5,0.5,0.5,1.5,0.5,1.5,1.5,1.5,1.5,1.5,1.5,0.5,1.5,-0.5,-1.5,0.5,-1.5,-1.5,0.5,-1.5,-1.5,1.5,-0.5,-1.5,1.5,0.5,1.5,0.5,1.5,1.5,0.5,1.5,1.5,1.5,1.5,1.5,1.5,0.5,1.5,1.5,0.5,-1.5,1.5,0.5,-0.5,1.5,1.5,-0.5,1.5,1.5,-1.5,1.5,-1.5,-1.5,0.5,-1.5,-0.5,0.5,-1.5,-0.5,1.5,-1.5,-1.5,0.5,-1.5,-1.5,1.5,-0.5,-1.5,-1.5,-0.5,-0.5,-1.5,-1.5,-0.5,-1.5,-1.5,-1.5,-1.5,1.5,-1.5,-0.5,1.5,-0.5,-0.5,1.5,-0.5,-1.5,1.5,-1.5,-1.5,1.5,-0.5,1.5,1.5,0.5,1.5,1.5,0.5,0.5,1.5,-0.5,1.5,1.5,-0.5,0.5,1.5,-1.5,1.5,1.5,-0.5,1.5,1.5,-1.5,1.5,1.5,-1.5,0.5,-1.5,-0.5,-1.5,-1.5,0.5,-1.5,-1.5,0.5,-0.5,-1.5,-0.5,-1.5,-1.5,-0.5,-0.5,-1.5,-1.5,-1.5,-1.5,-0.5,-1.5,-1.5,-1.5,-1.5,-1.5,-1.5,-0.5,-1.5,-1.5,0.5,0.5,1.5,-1.5,1.5,1.5,-1.5,1.5,1.5,-0.5,1.5,1.5,-0.5,0.5,1.5,-0.5,1.5,1.5,-0.5,-0.5,-1.5,-1.5,-1.5,-1.5,-1.5,-1.5,-1.5,-0.5,-0.5,-1.5,-1.5,-1.5,-1.5,-0.5,-0.5,-1.5,-0.5,-1.5,-1.5,-0.5,-1.5,0.5,-1.5,-1.5,1.5,-1.5,-1.5,1.5,-0.5,-1.5,0.5,-1.5,1.5,0.5,1.5,1.5,1.5,1.5,1.5,1.5,0.5,1.5,0.5,1.5,1.5,1.5,0.5,1.5,1.5,0.5,1.5,-1.5,-0.5,0.5,-1.5,-0.5,0.5,-1.5,0.5,1.5,-1.5,-0.5,1.5,-1.5,0.5,1.5,-1.5,-1.5,0.5,-1.5,-1.5,1.5,-1.5,-1.5,1.5,-1.5,-0.5,-0.5,-1.5,-1.5,-1.5,1.5,-0.5,-0.5,1.5,-0.5,-0.5,1.5,0.5,-1.5,1.5,-0.5,-1.5,1.5,0.5,-1.5,1.5,-1.5,-0.5,1.5,-1.5,-1.5,1.5,-0.5,-0.5,1.5,-1.5,-0.5,1.5,-1.5,1.5,-0.5,-1.5,1.5,0.5,-1.5,0.5,0.5,-1.5,1.5,-0.5,-1.5,0.5,-0.5,-1.5,1.5,-1.5,-1.5,1.5,-0.5,-1.5,0.5,-1.5,-1.5,0.5,-1.5,-1.5,0.5,-1.5,-1.5,-1.5,-0.5,1.5,-1.5,0.5,1.5,-0.5,0.5,1.5,-1.5,-0.5,1.5,-0.5,-0.5,1.5,-1.5,-1.5,1.5,-1.5,-0.5,1.5,-0.5,-1.5,1.5,-0.5,-1.5,1.5,-0.5,-1.5,1.5,-1.5,1.5,0.5,-0.5,1.5,1.5,-1.5,1.5,0.5,-1.5,1.5,1.5,0.5,1.5,1.5,0.5,1.5,1.5,1.5,-1.5,0.5,0.5,-1.5,1.5,1.5,-1.5,0.5,0.5,-1.5,1.5,1.5,-1.5,1.5,0.5,-1.5,1.5,-1.5,0.5,1.5,-1.5,1.5,1.5,-0.5,1.5,1.5,-1.5,0.5,1.5,-0.5,1.5,1.5,-0.5,1.5,1.5,1.5,0.5,-1.5,1.5,1.5,-1.5,0.5,1.5,-1.5,1.5,0.5,-1.5,0.5,1.5,-1.5,0.5,1.5,-1.5],"uvs":[0.666667,0.666667,0.666667,0.75,0.75,0.75,0.75,0.666667,0.916667,0.916667,0.916667,1,1,1,1,0.916667,0.333333,0.916667,0.333333,1,0.25,1,0.25,0.916667,0.083333,0.666667,0.083333,0.75,0,0.75,0,0.666667,0.416667,0.833333,0.5,0.833333,0.5,0.75,0.416667,0.75,0.583333,0.833333,0.5,0.833333,0.5,0.75,0.5,0.75,0.583333,0.75,0.083333,0.5,0.083333,0.583333,0,0.583333,0,0.5,0.333333,0.75,0.333333,0.833333,0.25,0.833333,0.333333,0.75,0.25,0.75,0.916667,0.75,0.916667,0.833333,1,0.833333,1,0.75,0.666667,0.5,0.666667,0.583333,0.75,0.583333,0.75,0.5,0.5,0.583333,0.5,0.666667,0.583333,0.666667,0.5,0.583333,0.583333,0.583333,0.5,0.5,0.5,0.583333,0.5,0.5,0.583333,0.5,0.5,0.833333,0.5,0.916667,0.416667,0.916667,0.5,0.833333,0.416667,0.833333,0.5,0.75,0.5,0.833333,0.5,0.75,0.416667,0.75,0.333333,0.75,0.583333,1,0.5,1,0.5,0.916667,0.5,0.916667,0.583333,0.916667,0.5,0.916667,0.416667,1,0.5,1,0.5,0.916667,0.416667,1,0.5,0.916667,0.416667,0.916667,0.5,0.916667,0.5,0.916667,0.5,1,0.416667,1,0.5,0.916667,0.5,0.666667,0.5,0.75,0.583333,0.75,0.5,0.666667,0.583333,0.75,0.583333,0.75,0.25,0.916667,0.333333,0.916667,0.333333,0.833333,0.25,0.916667,0.25,0.833333,0.25,1,0.333333,1,0.25,1,0.25,0.916667,0.416667,1,0.75,0.916667,0.666667,0.916667,0.666667,0.833333,0.75,0.916667,0.75,0.833333,0.75,1,0.666667,1,0.75,0.916667,0.666667,1,0.666667,1,0.75,0.833333,0.75,0.916667,0.833333,0.916667,0.75,0.833333,0.833333,0.833333,0.75,0.75,0.75,0.833333,0.833333,0.75,0.833333,0.75,0.833333,0.75,0.25,0.583333,0.25,0.666667,0.166667,0.666667,0.25,0.583333,0.166667,0.583333,0.25,0.5,0.25,0.583333,0.166667,0.5,0.166667,0.5,0.166667,0.5,0.75,0.833333,0.666667,0.75,0.75,0.833333,0.75,0.75,0.583333,0.75,0.583333,0.75,0.25,0.833333,0.333333,0.75,0.25,0.833333,0.333333,0.75,0.25,0.75,0.333333,0.75,0.25,0.666667,0.25,0.75,0.166667,0.75,0.25,0.666667,0.166667,0.75,0.166667,0.75,0.75,0.916667,0.75,1,0.833333,1,0.75,0.916667,0.833333,1,0.833333,1],"indices":[0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,23,24,25,26,27,25,27,28,26,12,15,26,15,27,29,30,31,32,31,33,30,8,11,30,11,31,34,35,36,34,36,37,35,4,7,35,7,36,38,39,40,38,40,41,39,0,3,39,3,40,42,43,44,45,44,46,46,44,0,46,0,39,47,48,46,49,46,50,50,46,39,50,39,38,51,52,53,54,53,55,55,53,8,55,8,30,56,57,55,58,55,59,59,55,30,59,30,60,61,62,63,61,64,65,65,66,21,65,21,20,67,68,69,70,71,72,72,73,17,72,17,16,74,75,76,77,76,53,53,76,9,53,9,8,78,79,80,81,82,44,44,83,1,44,1,0,84,85,86,87,86,88,85,72,16,85,16,86,89,90,85,91,85,92,90,93,72,90,72,85,94,95,96,97,96,98,95,65,20,95,20,96,99,100,95,99,95,101,102,61,65,103,65,95,104,105,106,107,106,108,108,106,4,108,4,35,109,110,108,109,108,111,112,108,35,113,35,34,114,115,116,117,116,118,118,116,12,118,12,26,119,120,118,119,118,121,122,118,26,123,26,25,124,96,125,126,125,127,96,20,128,96,129,125,130,86,131,132,133,134,86,16,19,86,19,135,136,137,138,139,140,116,116,141,13,116,13,12,142,143,144,145,146,106,106,147,5,106,5,4]}
};
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
        //vertexData.uvs = cube.atlas.uvs;
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
        c.checkCollisions = true;
        c.position.set(x, 1.5, y);
        c.rotate(BABYLON.Axis.Y, Math.PI * ~~(Math.random() * 4));
    }

    private _createCorridor(x: number, y: number) {
        let c = this._baseCube.createInstance(`floor-${x}-${y}`);
        c.checkCollisions = true;
        c.position.set(x, -1.5, y);
        c = this._baseCube.createInstance(`ceiling-${x}-${y}`);
        c.position.set(x, 4.5, y);
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
