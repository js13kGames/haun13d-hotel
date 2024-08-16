import {GL} from './GL';
import vertexShader from '../shaders/shader.vert';
import fragmentShader from '../shaders/shader.frag';

export class WebGLRenderer {
    gl: WebGL2RenderingContext;
    color: number[];
    masks: number;
    depthTest: boolean;
    program: WebGLProgram;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;

        this.color = [0.3, 0.3, 0.3, 1];
        this.gl.clearColor(0, 0, 0, 1);

        this.masks = gl.COLOR_BUFFER_BIT;
        this.depthTest = false;
        this.depthTesting(true); // if you don't know what that means - it means that our meshes will be rendered properly ¯\_(ツ)_/¯

        this.compileShaders();
    }

    depthTesting(enable) {
        if (enable && !this.depthTest) {
            this.masks = GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT;
            this.gl.enable(GL.DEPTH_TEST);

            this.depthTest = true;
        } else if (!enable && this.depthTest) {
            this.masks = GL.COLOR_BUFFER_BIT;
            this.gl.disable(GL.DEPTH_TEST);

            this.depthTest = false;
        }
    }
    /**
     * Clears the canvas with the specified color.
     * @param color - An array of RGBA values between 0 and 1 representing the color to clear the canvas with.
     */
    clear(color = [0, 0, 0, 1]) {
        if (color != this.color) {
            this.gl.clearColor(color[0], color[1], color[2], color[3]);
            this.color = color;
        }
        this.gl.clear(this.masks);
    }

    compileShaders() {
        const vShader = this.gl.createShader(this.gl.VERTEX_SHADER)!;
        this.gl.shaderSource(vShader, vertexShader);
        this.gl.compileShader(vShader);
        if (!this.gl.getShaderParameter(vShader, this.gl.COMPILE_STATUS)) {
            const info = this.gl.getShaderInfoLog(vShader);
            throw `Could not compile WebGL program. \n\n${info}`;
        }

        const fShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)!;
        this.gl.shaderSource(fShader, fragmentShader);
        this.gl.compileShader(fShader);
        if (!this.gl.getShaderParameter(fShader, this.gl.COMPILE_STATUS)) {
            const info = this.gl.getShaderInfoLog(fShader);
            throw `Could not compile WebGL program. \n\n${info}`;
        }
        //const deb = this.gl.getExtension('WEBGL_debug_shaders');

        const program = this.gl.createProgram()!;
        this.gl.attachShader(program, vShader);
        this.gl.attachShader(program, fShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            const info = this.gl.getProgramInfoLog(program);
            throw new Error(`Could not compile WebGL program. \n\n${info}`);
        }

        // this.projectionLoc = this.gl.getUniformLocation(program, 'uProjection')!;
        // this.viewLoc = this.gl.getUniformLocation(program, 'uView')!;
        // this.colorsLoc = this.gl.getUniformLocation(program, 'uColors')!;
        // this.ambientColorLoc = this.gl.getUniformLocation(program, 'uAmbientColor')!;
        // this.lightingDirectionLoc = this.gl.getUniformLocation(program, 'uLightingDirection')!;
        // this.directionalColorLoc = this.gl.getUniformLocation(program, 'uDirectionalColor')!;
        //this.gl.enableVertexAttribArray(this.matrixLoc);
        this.program = program;
    }

    render(scene) {
        this.gl.useProgram(this.program!);
        this.gl.drawArrays(GL.POINTS, 0, 1);
        /* Clear canvas, render objects from scene */
    }
}
