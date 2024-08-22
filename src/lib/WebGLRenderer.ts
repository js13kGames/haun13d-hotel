import {GL} from './GL';
import {Scene} from './Scene';
import vertexShader from '../shaders/shader.vert';
import fragmentShader from '../shaders/shader.frag';
import {Matrix4} from './Math/Matrix4';

interface ProgramInfo {
    program: WebGLProgram;
    attribLocations: {
        vertexPosition: number;
    };
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation | null;
        modelMatrix: WebGLUniformLocation | null;
        viewMatrix: WebGLUniformLocation | null;
        vertexColor: WebGLUniformLocation | null;
    };
}

export class WebGLRenderer {
    gl: WebGL2RenderingContext;
    vs!: WebGLShader;
    fs!: WebGLShader;
    program!: WebGLProgram;
    viewLoc!: WebGLUniformLocation;
    projectionLoc!: WebGLUniformLocation;
    programInfo: ProgramInfo | null = null;
    buffer: {position: WebGLBuffer | null};

    /**
     *
     */
    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.gl.enable(GL.DEPTH_TEST);
        // Vertex shader
        this.gl.shaderSource((this.vs = this.gl.createShader(GL.VERTEX_SHADER)!), vertexShader);
        // #version 300 es
        // #pragma vscode_glsllint_stage: vert
        // precision lowp float;
        // in vec4 c,p,u;
        // uniform mat4 M,m;
        // uniform mat4 uProjection;
        // uniform mat4 uView;

        // out vec4 C,P,U;
        // void main(){gl_Position=M*p;P=m*p;C=c;U=u;
        // }
        //     );
        this.gl.compileShader(this.vs);
        console.log('vertex shader:', gl.getShaderInfoLog(this.vs) || 'OK');

        // Fragment shader
        this.gl.shaderSource((this.fs = this.gl.createShader(GL.FRAGMENT_SHADER)!), fragmentShader);
        // #version 300 es
        // #pragma vscode_glsllint_stage: frag
        // precision lowp float;
        // uniform vec3 c,d,a;
        // in vec4 C,P,U;
        // out vec4 o;
        // uniform sampler2D s;
        // void main(){
        //     float n=max(dot(d,-normalize(cross(dFdx(P.xyz),dFdy(P.xyz)))),0.);
        //     o=mix(texture(s,U.xy),vec4(c*C.rgb*n+a*C.rgb,1.),C.a);
        // }
        //     );
        this.gl.compileShader(this.fs);
        console.log('fragment shader:', gl.getShaderInfoLog(this.fs) || 'OK');

        // Program
        this.program = this.gl.createProgram()!;
        this.gl.attachShader(this.program, this.vs);
        this.gl.attachShader(this.program, this.fs);
        this.gl.linkProgram(this.program);
        this.gl.useProgram(this.program);

        this.projectionLoc = this.gl.getUniformLocation(this.program, 'uProjection')!;
        this.viewLoc = this.gl.getUniformLocation(this.program, 'uView')!;

        // write shader debug info
        console.log('program:', this.gl.getProgramInfoLog(this.program) || 'OK');

        this.programInfo = {
            program: this.program,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(this.program, 'aVertexPosition'),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(this.program, 'uProjectionMatrix'),
                modelMatrix: this.gl.getUniformLocation(this.program, 'uModelMatrix'),
                viewMatrix: gl.getUniformLocation(this.program, 'uViewMatrix'),
                vertexColor: this.gl.getUniformLocation(this.program, 'aVertexColor'),
            },
        };
        this.buffer = this.initBuffers();
    }

    initBuffers() {
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(GL.ARRAY_BUFFER, positionBuffer);

        // Positions for a full-screen quad
        const positions = [60.0, -1, 60.0, -60, -1.0, 60.0, 60, -1.0, -60.0, -60.0, -1.0, -60.0];

        this.gl.bufferData(GL.ARRAY_BUFFER, new Float32Array(positions), GL.STATIC_DRAW);

        return {
            position: positionBuffer,
        };
    }

    // Set uv buffer
    draw(
        // Set uv buffer
        c: number[],
        matrixData: Float32Array,
        numInstances: number,
        projectionMatrix: Float32Array,
        transform: XRRigidTransform
    ) {
        // render(gl, programInfo, buffers) {
        this.gl.clearColor(0.1, 0.1, 0.0, 1.0); // Clear to black, fully opaque
        //  this.gl.clearDepth(1.0); // Clear everything
        this.gl.enable(GL.DEPTH_TEST); // Enable depth testing
        this.gl.depthFunc(GL.LEQUAL); // Near things obscure far things

        // Clear the canvas before we start drawing on it
        this.gl.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        // Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute
        if (this.programInfo?.attribLocations.vertexPosition !== -1) {
            const numComponents = 3; // pull out 2 values per iteration
            const type = GL.FLOAT; // the data in the buffer is 32bit floats
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set of values to the next
            const offset = 0; // how many bytes inside the buffer to start from
            this.gl.bindBuffer(GL.ARRAY_BUFFER, this.buffer.position);
            this.gl.vertexAttribPointer(
                this.programInfo?.attribLocations.vertexPosition!,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            this.gl.enableVertexAttribArray(this.programInfo?.attribLocations.vertexPosition!);
        } else {
            console.error('Attribute location for vertexPosition is -1');
        }

        // Tell WebGL to use our program when drawing
        this.gl.useProgram(this.program);

        // Set the shader uniforms
        this.gl.uniformMatrix4fv(this.programInfo?.uniformLocations.projectionMatrix!, false, projectionMatrix);
        this.gl.uniformMatrix4fv(this.programInfo?.uniformLocations.viewMatrix!, false, transform.inverse.matrix);
        this.gl.uniformMatrix4fv(this.programInfo?.uniformLocations.modelMatrix!, false, Matrix4.Identity);
        this.gl.uniform4f(this.programInfo?.uniformLocations.vertexColor!, 0, 1, 0, 1); // green (but not used)

        const offset = 0;
        const vertexCount = 4; // We're drawing a quad
        this.gl.drawArrays(GL.TRIANGLE_STRIP, offset, vertexCount);
    }

    render2(scene: Scene, aspectratio, program, i, vertices, uv, modelMatrix, texture, a) {
        // Set the clear color
        this.gl.clearColor(0.5, 0.5, 0.5, 1);
        //enable the depth test
        this.gl.enable(2929);

        // Set the diffuse light color and direction
        this.gl.uniform3f(this.gl.getUniformLocation(program, 'c'), ...[1, 1, 1]);
        this.gl.uniform3f(this.gl.getUniformLocation(program, 'd'), ...[3, -5, -10]);

        // Set the ambient light color
        this.gl.uniform3f(this.gl.getUniformLocation(program, 'a'), ...[0.3, 0.3, 0.2]);

        // Clear color buffer and depth buffer
        this.gl.clear(16640);

        // Render each object
        for (i of scene.children) {
            // Default blending method for transparent objects
            this.gl.blendFunc(770 /* SRC_ALPHA */, 771 /* ONE_MINUS_SRC_ALPHA */);

            // Enable texture 0
            this.gl.activeTexture(33984 /* TEXTURE0 */);

            // Initialize the model (cube by default)
            [vertices, uv] = cube(); //(window[i.m] || cube)();

            // Alpha-blending
            this.gl.enable(3042 /* BLEND */);

            // Set position buffer
            this.gl.bindBuffer(34962, this.gl.createBuffer());
            this.gl.bufferData(34962, new Float32Array(vertices), 35044);
            this.gl.vertexAttribPointer((a = this.gl.getAttribLocation(program, 'p')), 3, 5126, false, 0, 0);
            this.gl.enableVertexAttribArray(a);

            // Set uv buffer
            this.gl.bindBuffer(34962, this.gl.createBuffer());
            this.gl.bufferData(34962, new Float32Array(uv), 35044);
            this.gl.vertexAttribPointer((a = this.gl.getAttribLocation(program, 'u')), 2, 5126, false, 0, 0);
            this.gl.enableVertexAttribArray(a);

            // Set the model matrix
            modelMatrix = new DOMMatrix()
                .translate(...(i.p || [0, 0, 0]))
                .rotate(...(i.r || [0, 0, 0]))
                .scale(...(i.s || [1, 1, 1]));
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(program, 'm'), false, modelMatrix.toFloat32Array());

            // Set the model's color
            if (i.c) {
                this.gl.vertexAttrib3f(this.gl.getAttribLocation(program, 'c'), ...i.c);
            }

            // or texture
            else {
                this.gl.vertexAttrib4f(this.gl.getAttribLocation(program, 'c'), 0, 0, 0, 0);
                if (i.t) {
                    texture = this.gl.createTexture();
                    this.gl.pixelStorei(37441 /* UNPACK_PREMULTIPLY_ALPHA_WEBGL */, 1);
                    this.gl.bindTexture(3553 /* TEXTURE_2D */, texture);
                    this.gl.pixelStorei(37440 /* UNPACK_FLIP_Y_WEBGL */, 1);
                    this.gl.texImage2D(
                        3553 /* TEXTURE_2D */,
                        0,
                        6408 /* RGBA */,
                        6408 /* RGBA */,
                        5121 /* UNSIGNED_BYTE */,
                        i.t
                    );
                    this.gl.generateMipmap(3553 /* TEXTURE_2D */);
                    this.gl.bindTexture(3553 /* TEXTURE_2D */, texture);
                    this.gl.uniform1i(this.gl.getUniformLocation(program, 's'), 0);
                }
            }

            // Set the cube's mvp matrix (camera x model)
            // Camera matrix (fov: 30deg, near: 0.1, far: 100)
            this.gl.uniformMatrix4fv(
                this.gl.getUniformLocation(program, 'M'),
                false,
                new DOMMatrix([1.8 / aspectratio, 0, 0, 0, 0, 1.8, 0, 0, 0, 0, -1.001, -1, 0, 0, -0.2, 0])
                    .rotate(...scene.camera.rotation)
                    .translate(...scene.camera.position)
                    .multiply(modelMatrix)
                    .toFloat32Array()
            );

            // Render
            // (Special case for plane: render the front face of a cube)
            this.gl.drawArrays(4, 0, i.m == 'plane' ? 6 : vertices.length / 3);
        }
    }
}

// Declare a cube (2x2x2)
// Returns [vertices, uvs)]
//
//    v6----- v5
//   /|      /|
//  v1------v0|
//  | |   x | |
//  | |v7---|-|v4
//  |/      |/
//  v2------v3

export const cube = () => [
    [
        1,
        1,
        1,
        -1,
        1,
        1,
        -1,
        -1,
        1, // front
        1,
        1,
        1,
        -1,
        -1,
        1,
        1,
        -1,
        1,
        1,
        1,
        -1,
        1,
        1,
        1,
        1,
        -1,
        1, // right
        1,
        1,
        -1,
        1,
        -1,
        1,
        1,
        -1,
        -1,
        1,
        1,
        -1,
        -1,
        1,
        -1,
        -1,
        1,
        1, // up
        1,
        1,
        -1,
        -1,
        1,
        1,
        1,
        1,
        1,
        -1,
        1,
        1,
        -1,
        1,
        -1,
        -1,
        -1,
        -1, // left
        -1,
        1,
        1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1,
        -1,
        1,
        -1,
        1,
        1,
        -1,
        1,
        -1,
        -1, // back
        -1,
        1,
        -1,
        1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1,
        -1,
        1,
        -1,
        -1,
        1,
        -1,
        -1,
        -1, // down
        1,
        -1,
        1,
        -1,
        -1,
        -1,
        1,
        -1,
        -1,
    ],

    [
        1,
        1,
        0,
        1,
        0,
        0, // front
        1,
        1,
        0,
        0,
        1,
        0,
        1,
        1,
        0,
        1,
        0,
        0, // right
        1,
        1,
        0,
        0,
        1,
        0,
        1,
        1,
        0,
        1,
        0,
        0, // up
        1,
        1,
        0,
        0,
        1,
        0,
        1,
        1,
        0,
        1,
        0,
        0, // left
        1,
        1,
        0,
        0,
        1,
        0,
        1,
        1,
        0,
        1,
        0,
        0, // back
        1,
        1,
        0,
        0,
        1,
        0,
        1,
        1,
        0,
        1,
        0,
        0, // down
        1,
        1,
        0,
        0,
        1,
        0,
    ],
];
