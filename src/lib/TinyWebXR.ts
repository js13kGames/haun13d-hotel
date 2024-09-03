/*
 * TinyWebXR.ts
 * A tiny WebXR API wrapper for JS13KGames.
 * Based on Xem's 'W' library (https://xem.github.io/W/).
 */

import vertexShader from '../shaders/shader.vert';
import fragmentShader from '../shaders/shader.frag';

export const RADDEG = 180 / Math.PI;

/**
 * The DOMMatrix defined in the DOM type doesn't allow another in its contructor while
 * this is valid in the browser. This is a workaround to allow the use of DOMMatrix in the
 */
interface DOMMatrixConstructor {
    new (init?: DOMMatrix | DOMMatrixInit | string | Float32Array): DOMMatrix;
}

declare var DOMMatrix: DOMMatrixConstructor;

export interface objectState {
    size?: number;
    /**
     * Width
     */
    w?: number;
    /**
     * Height
     */
    h?: number;
    /**
     * Depth
     */
    d?: number;
    /**
     * Texture image, for now limited to HTMLCanvasElement or HTMLImageElement
     */
    t?: HTMLCanvasElement | HTMLImageElement;
    /**
     * light, group or object
     */
    type?: string;
    /**
     * Mix between the object's color and the texture (0 to 1)
     */
    mix?: number;
    /**
     * Custom name or default name ('o' + auto-increment)
     */
    n?: string;
    x?: number;
    y?: number;
    z?: number;
    rx?: number;
    ry?: number;
    rz?: number;
    b?: string;
    mode?: number;
    g?: string;
    M?: DOMMatrix;
    m?: DOMMatrix;

    // in case of controllers, this holds the gamepad button values
    btn?: readonly GamepadButton[];
    fwd?: number[];

    // no idea what these are, possibly for animations
    f?: number;
    a?: number;
}

/**
 * TinyWebXR is a class that provides a simple API to interact with WebXR, build for JS13KGames.
 */
export class TinyWebXR {
    webglCanvas: HTMLCanvasElement;
    gl: WebGL2RenderingContext;
    xrButton: HTMLButtonElement;
    xrSession: XRSession | undefined;
    xrRefSpace!: XRReferenceSpace | XRBoundedReferenceSpace;
    lastFrame: number = 0;

    objs = 0; // Object counter
    current = {}; // Objects current states
    next: {[key: string]: objectState} = {}; // Objects next states
    textures = {}; // Textures list
    models = {}; // Models list

    projection!: DOMMatrix;
    ambientLight: any;
    program!: WebGLProgram;

    callback: ((dt: number) => void) | undefined;
    sessionRequested: () => void = () => {};

    /**
     * Creates a new instance of TinyWebXR.
     */
    constructor(xrButtonId: string = 'xr-button') {
        this.webglCanvas = document.createElement('canvas');

        // Create a WebGL context to render with, initialized to be compatible
        // with the XRDisplay we're presenting to.
        this.gl = this.webglCanvas.getContext('webgl2', {
            xrCompatible: true,
            alpha: false,
        })!;
        this._compileShaders();

        this.xrButton = document.getElementById(xrButtonId) as HTMLButtonElement;

        // Is WebXR available on this UA?
        if (navigator.xr) {
            // If the device allows creation of exclusive sessions set it as the
            // target of the 'Enter XR' button.
            navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
                this.xrButton!.innerText = supported ? 'Enter VR' : 'VR not available';
                if (supported) {
                    this.xrButton!.addEventListener('click', this.onRequestSession.bind(this));
                }
            });
        }

        // Set the scene's background color (RGBA)
        this.setClearColor('000');

        // Clear the color and depth buffer
        this.gl.enable(this.gl.DEPTH_TEST);

        this.light({type: 'light', y: -1});
        this._defineCube();
        this._definePlane();

        this.add('LH', {n: 'LH', type: 'group'});
        this.add('RH', {n: 'RH', type: 'group'});
    }

    setClearColor(color: string) {
        this.gl.clearColor(...this.col(color));
    }

    /**
     *  Called when the user selects a device to present to. In response we
     * will request an exclusive session from that device.
     */
    onRequestSession() {
        this.sessionRequested();
        return navigator.xr!.requestSession('immersive-vr').then(this.onSessionStarted.bind(this));
    }

    /**
     * Called when we've successfully acquired a XRSession. In response we
     * will set up the necessary session state and kick off the frame loop.
     */
    onSessionStarted(session: XRSession) {
        // Listen for the sessions 'end' event so we can respond if the user
        // or UA ends the session for any reason.
        session.addEventListener('end', this.onSessionEnded.bind(this));

        this.xrSession = session; // we set our session to be the session our request created
        this.xrSession.addEventListener('end', this.onSessionEnded.bind(this)); // we set what happenes when our session is ended

        this.xrSession.updateRenderState({
            baseLayer: new XRWebGLLayer(this.xrSession, this.gl),
        }); // this line simply sets our session's WebGL context to our WebGL2 context

        session.updateRenderState({baseLayer: new XRWebGLLayer(session, this.gl)});

        session.requestReferenceSpace('local').then((refSpace) => {
            // make sure the camera starts 1.6m below the floor level
            const xform = new XRRigidTransform({y: -1.6});
            this.xrRefSpace = refSpace.getOffsetReferenceSpace(xform);

            session.requestAnimationFrame(this.onXRFrame.bind(this));
        });
    }

    /**
     * Called either when the user has explicitly ended the session (like in
     * onEndSession()) or when the UA has ended the session for any reason.
     * At this point the session object is no longer usable and should be
     * discarded.
     * @param event The event that caused the session to end.
     */
    onSessionEnded(event) {
        this.xrSession = undefined;
    }

    /** Used for calculating Delta Time */
    prevTime: number | null = null;

    onXRFrame(now: DOMHighResTimeStamp, frame: XRFrame) {
        const session = frame.session;

        const transparent: objectState[] = []; // Transparent objects

        // Loop and measure time delta between frames
        const dt = now - this.lastFrame;
        this.lastFrame = now;

        session.requestAnimationFrame(this.onXRFrame.bind(this));
        if (this.callback) this.callback(dt);

        const pose = frame.getViewerPose(this.xrRefSpace);
        // Clear canvas

        if (pose) {
            let glLayer = session.renderState.baseLayer!;

            this.updateInputSources(frame, this.xrRefSpace);

            // If we do have a valid pose, bind the WebGL layer's framebuffer,
            // which is where any content to be displayed on the XRDevice must be
            // rendered.
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, glLayer.framebuffer);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            // Render both views, for left and right eyes
            for (const view of pose.views) {
                const viewport = session.renderState.baseLayer?.getViewport(view);
                if (viewport) {
                    this.gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
                }

                // Send projectoin matrix to the shader
                this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, 'p'), false, view.projectionMatrix);
                // Send view matrix to the shader
                this.gl.uniformMatrix4fv(
                    this.gl.getUniformLocation(this.program, 'v'),
                    false,
                    view.transform.inverse.matrix
                );

                // Create Batch per material
                for (const i in this.next) {
                    const o = this.next[i];
                }

                // Render all the objects in the scene
                for (const i in this.next) {
                    if (!this.next[i].t && this.col(this.next[i].b ?? '888F')[3] == 1) {
                        this.render(this.next[i], dt);
                    } else {
                        transparent.push(this.next[i]);
                    }
                }

                // Order transparent objects from back to front
                transparent.sort((a, b) => this.dist(b) - this.dist(a));

                // Enable alpha blending
                this.gl.enable(this.gl.BLEND);
                // set black to be transparent
                this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

                // Render all transparent objects
                for (const i of transparent) {
                    if (['plane', 'billboard'].includes(i.type!)) this.gl.depthMask(false);
                    this.render(i, dt);
                    this.gl.depthMask(true);
                }

                // Disable alpha blending for the next frame
                this.gl.disable(this.gl.BLEND);
            }
        }

        // Assuming you have an array of light positions called `lightPositions`,
        // where each light position is a vec3 (an array of 3 numbers)
        const lightPositions = [
            [0, 1.5, -4],
            [0, 1.5, -8],
            [0, 1.5, 0],
            // ... up to 10 lights
        ];
        const lightColors = [
            [1, 0, 0, 1],
            [0, 0, 1, 1],
            [0.5, 0.5, 0.5, 1],
            // ... up to 10 lights
        ];

        // Set the light positions array
        this.gl.uniform3fv(
            this.gl.getUniformLocation(this.program, 'light_pos'),
            new Float32Array(lightPositions.flat())
        );

        // Set the number of active lights
        this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'num_lights'), lightPositions.length);

        // Assuming you still want to set a single light color
        this.gl.uniform4fv(this.gl.getUniformLocation(this.program, 'light_col'), new Float32Array(lightColors.flat()));
        //...this.col(this.lerp('light', 'b')));

        // // Transition the light's direction and send it to the shaders
        // this.gl.uniform3f(
        //     this.gl.getUniformLocation(this.program, 'light_pos'),
        //     this.lerp('light', 'x'),
        //     this.lerp('light', 'y'),
        //     this.lerp('light', 'z')
        // );
        // this.gl.uniform4f(this.gl.getUniformLocation(this.program, 'light_col'), ...this.col(this.lerp('light', 'b')));
    }

    // Render an object
    render = (object, dt, just_compute = ['camera', 'light', 'group'].includes(object.type), buffer = undefined) => {
        // If the object has a texture
        if (object.t) {
            // Set the texture's target (2D or cubemap)
            this.gl.bindTexture(3553 /* TEXTURE_2D */, this.textures[object.t.id]);

            // Pass texture 0 to the sampler
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'sampler'), 0);
        }

        // If the object has an animation, increment its timer...
        if (object.f < object.a) object.f += dt;

        // ...but don't let it go over the animation duration.
        if (object.f > object.a) object.f = object.a;

        // Compose the model matrix from lerped transformations
        this.next[object.n].m = this.animation(object.n);

        // If the object is in a group:
        if (this.next[object.g]) {
            // premultiply the model matrix by the group's model matrix.
            this.next[object.n].m!.preMultiplySelf(this.next[object.g].M || this.next[object.g].m);
        }

        // send the model matrix to the vertex shader
        this.gl.uniformMatrix4fv(
            this.gl.getUniformLocation(this.program, 'm'),
            false,
            (this.next[object.n].M! || this.next[object.n].m).toFloat32Array()
        );

        // send the inverse of the model matrix to the vertex shader
        this.gl.uniformMatrix4fv(
            this.gl.getUniformLocation(this.program, 'im'),
            false,
            new DOMMatrix(this.next[object.n].M || this.next[object.n].m).invertSelf().toFloat32Array()
        );

        // Don't render invisible items (camera, light, groups, camera's parent)
        if (!just_compute) {
            // Set up the position buffer
            this.gl.bindBuffer(34962 /* ARRAY_BUFFER */, this.models[object.type].verticesBuffer);
            const buffer = this.gl.getAttribLocation(this.program, 'pos');
            this.gl.vertexAttribPointer(buffer, 3, 5126 /* FLOAT */, false, 0, 0);
            this.gl.enableVertexAttribArray(buffer);

            // Set up the texture coordinatess buffer (if any)
            if (this.models[object.type].uvBuffer) {
                this.gl.bindBuffer(34962 /* ARRAY_BUFFER */, this.models[object.type].uvBuffer);
                const buffer = this.gl.getAttribLocation(this.program, 'uv');
                this.gl.vertexAttribPointer(buffer, 2, 5126 /* FLOAT */, false, 0, 0);
                this.gl.enableVertexAttribArray(buffer);
            }

            // Set the normals buffer
            if ((object.s || this.models[object.type].customNormals) && this.models[object.type].normalsBuffer) {
                this.gl.bindBuffer(34962 /* ARRAY_BUFFER */, this.models[object.type].normalsBuffer);
                const buffer = this.gl.getAttribLocation(this.program, 'normal');
                this.gl.vertexAttribPointer(buffer, 3, 5126 /* FLOAT */, false, 0, 0);
                this.gl.enableVertexAttribArray(buffer);
            }

            // Other options: [smooth, shading enabled, ambient light, texture/color mix]
            this.gl.uniform4f(
                this.gl.getUniformLocation(this.program, 'o'),

                // Enable smooth shading if "s" is true
                object.s,

                // Enable shading if in TRIANGLE* mode and object.ns disabled
                (object.mode > 3 || this.gl[object.mode] > 3) && !object.ns ? 1 : 0,

                // Ambient light
                this.ambientLight || 0.2,

                // Texture/color mix (if a texture is present. 0: fully textured, 1: fully colored)
                object.mix
            );

            // If the object is a billboard: send a specific uniform to the shaders:
            // [width, height, isBillboard = 1, 0]
            this.gl.uniform4f(
                this.gl.getUniformLocation(this.program, 'bb'),

                // Size
                object.w,
                object.h,

                // is a billboard
                object.type == 'billboard' ? 1 : 0,

                // Reserved
                0
            );

            // Set up the indices (if any)
            if (this.models[object.type].indicesBuffer) {
                this.gl.bindBuffer(34963 /* ELEMENT_ARRAY_BUFFER */, this.models[object.type].indicesBuffer);
            }

            // Set the object's color
            this.gl.vertexAttrib4fv(this.gl.getAttribLocation(this.program, 'col'), this.col(object.b));

            // Draw
            // Both indexed and unindexed models are supported.
            // You can keep the "drawElements" only if all your models are indexed.
            if (this.models[object.type].indicesBuffer) {
                this.gl.drawElements(
                    +object.mode || this.gl[object.mode],
                    this.models[object.type].indices.length,
                    5123 /* UNSIGNED_SHORT */,
                    0
                );
            } else {
                this.gl.drawArrays(
                    +object.mode || this.gl[object.mode],
                    0,
                    this.models[object.type].vertices.length / 3
                );
            }
        }
    };

    private _compileShaders() {
        this.gl.enable(this.gl.DEPTH_TEST);

        // Vertex shader
        const vs = this.gl.createShader(this.gl.VERTEX_SHADER)!;
        this.gl.shaderSource(vs, vertexShader);
        this.gl.compileShader(vs);

        // Fragment shader
        const fs = this.gl.createShader(this.gl.FRAGMENT_SHADER)!;
        this.gl.shaderSource(fs, fragmentShader);
        this.gl.compileShader(fs);

        // Create a shader program
        this.program = this.gl.createProgram()!;
        this.gl.attachShader(this.program, vs);
        this.gl.attachShader(this.program, fs);
        this.gl.linkProgram(this.program);
        this.gl.useProgram(this.program);

        // Log errors (optional)
        console.log('vertex shader:', this.gl.getShaderInfoLog(vs) || 'OK');
        console.log('fragment shader:', this.gl.getShaderInfoLog(fs) || 'OK');
        console.log('program:', this.gl.getProgramInfoLog(this.program) || 'OK');
    }

    setState(state: objectState, type: string | undefined = undefined) {
        //, texture, i, normal = [], A, B, C, Ai, Bi, Ci, AB, BC) => {
        // Custom name or default name ('o' + auto-increment)
        state.n ||= 'o' + this.objs++;

        // Size sets w, h and d at once (optional)
        if (state.size) state.w = state.h = state.d = state.size;

        // If a new texture is provided, build it and save it in W.textures
        if (state.t && state.t.width && !this.textures[state.t.id]) {
            const texture = this.gl.createTexture();
            this.gl.pixelStorei(37441 /* UNPACK_PREMULTIPLY_ALPHA_WEBGL */, true);
            this.gl.bindTexture(3553 /* TEXTURE_2D */, texture);
            this.gl.pixelStorei(37440 /* UNPACK_FLIP_Y_WEBGL */, 1);
            this.gl.texImage2D(
                3553 /* TEXTURE_2D */,
                0,
                6408 /* RGBA */,
                6408 /* RGBA */,
                5121 /* UNSIGNED_BYTE */,
                state.t
            );
            this.gl.texParameteri(3553, 10241 /* TEXTURE_MIN_FILTER */, 9728 /* NEAREST */);
            this.gl.texParameteri(3553, 10240 /* TEXTURE_MAG_FILTER */, 9728 /* NEAREST */);
            this.gl.generateMipmap(3553 /* TEXTURE_2D */);
            this.textures[state.t.id] = texture;
        }

        // Save object's type,
        // merge previous state (or default state) with the new state passed in parameter,
        // and reset f (the animation timer)
        state = {
            ...(this.current[state.n] = this.next[state.n] || {
                w: 1,
                h: 1,
                d: 1,
                x: 0,
                y: 0,
                z: 0,
                rx: 0,
                ry: 0,
                rz: 0,
                b: '888',
                mode: 4, // default is set to GLEnum.Triangles
                mix: 0,
                type,
                n: state.n,
            }),
            ...state,
            f: 0,
        };

        // Build the model's vertices buffer if it doesn't exist yet
        if (this.models[state.type!]?.vertices && !this.models?.[state.type!].verticesBuffer) {
            this.gl.bindBuffer(
                34962 /* ARRAY_BUFFER */,
                (this.models[state.type!].verticesBuffer = this.gl.createBuffer())
            );
            this.gl.bufferData(
                34962 /* ARRAY_BUFFER */,
                new Float32Array(this.models[state.type!].vertices),
                35044 /*STATIC_DRAW*/
            );

            // Compute smooth normals if they don't exist yet (optional)
            // TODO
            // if (!W.models[state.type].normals && W.smooth) W.smooth(state);

            // Make a buffer from the smooth/custom normals (if any)
            // if (W.models[state.type].normals) {
            //     W.gl.bindBuffer(34962 /* ARRAY_BUFFER */, (W.models[state.type].normalsBuffer = W.gl.createBuffer()));
            //     W.gl.bufferData(
            //         34962 /* ARRAY_BUFFER */,
            //         new Float32Array(W.models[state.type].normals.flat()),
            //         35044 /*STATIC_DRAW*/
            //     );
            // }
        }

        // Build the model's uv buffer (if any) if it doesn't exist yet
        if (this.models[state.type!]?.uv && !this.models[state.type!].uvBuffer) {
            this.gl.bindBuffer(34962 /* ARRAY_BUFFER */, (this.models[state.type!].uvBuffer = this.gl.createBuffer()));
            this.gl.bufferData(
                34962 /* ARRAY_BUFFER */,
                new Float32Array(this.models[state.type!].uv),
                35044 /*STATIC_DRAW*/
            );
        }

        // Build the model's index buffer (if any) and smooth normals if they don't exist yet
        if (this.models[state.type!]?.indices && !this.models[state.type!].indicesBuffer) {
            this.gl.bindBuffer(
                34963 /* ELEMENT_ARRAY_BUFFER */,
                (this.models[state.type!].indicesBuffer = this.gl.createBuffer())
            );
            this.gl.bufferData(
                34963 /* ELEMENT_ARRAY_BUFFER */,
                new Uint16Array(this.models[state.type!].indices),
                35044 /* STATIC_DRAW */
            );
        }

        // Set mix to 1 if no texture is set
        if (!state.t) {
            state.mix = 1;
        }

        // set mix to 0 by default if a texture is set
        else if (state.t && !state.mix) {
            state.mix = 0;
        }

        // Save new state
        this.next[state.n!] = state;

        return state;
    }

    updateInputSources(frame: XRFrame, refSpace: XRReferenceSpace) {
        for (const inputSource of frame.session.inputSources) {
            //   let gripPose = frame.getPose(inputSource.gripSpace!, refSpace)!;
            let gripPose = frame.getPose(inputSource.targetRaySpace!, refSpace)!;
            //   console.log(gripPose.transform.orientation, targetRayPose.transform.orientation);
            if (!gripPose) continue;
            const pos = gripPose.transform.position;
            const rot = this.toEuler(gripPose.transform.orientation);
            const forward = [0, 0, -1];
            const fwd = this.applyQuaternion(forward, gripPose.transform.orientation);
            //convert Radiant to Degree
            rot.x = rot.x * RADDEG;
            rot.y = rot.y * RADDEG;
            rot.z = rot.z * RADDEG;
            let buttons = inputSource.gamepad?.buttons;
            if (inputSource.handedness == 'left') {
                this.setState(
                    {x: pos.x, y: pos.y, z: pos.z, rx: rot.x, ry: rot.y, rz: rot.z, fwd: fwd, btn: buttons, n: 'LH'},
                    'group'
                );
            } else {
                this.setState(
                    {x: pos.x, y: pos.y, z: pos.z, rx: rot.x, ry: rot.y, rz: rot.z, fwd: fwd, btn: buttons, n: 'RH'},
                    'group'
                );
            }
        }
    }

    // Helpers
    // -------

    // Interpolate a property between two values
    lerp = (item, property) =>
        this.next[item]?.a
            ? this.current[item][property] +
              (this.next[item][property] - this.current[item][property]) * (this.next[item].f! / this.next[item].a)
            : this.next[item][property];

    // Transition an item
    animation = (item, m = new DOMMatrix()) =>
        this.next[item]
            ? m
                  .translateSelf(this.lerp(item, 'x'), this.lerp(item, 'y'), this.lerp(item, 'z'))
                  .rotateSelf(this.lerp(item, 'rx'), this.lerp(item, 'ry'), this.lerp(item, 'rz'))
                  .scaleSelf(this.lerp(item, 'w'), this.lerp(item, 'h'), this.lerp(item, 'd'))
            : m;

    // Compute the distance squared between two objects (useful for sorting transparent items)
    dist = (a, b = this.next['camera']) =>
        a?.m && b?.m ? (b.m.m41 - a.m.m41) ** 2 + (b.m.m42 - a.m.m42) ** 2 + (b.m.m43 - a.m.m43) ** 2 : 0;

    // Set the ambient light level (0 to 1)
    ambient = (a) => (this.ambientLight = a);

    // Convert an rgb/rgba hex string into a vec4
    // Convert an rgb/rgba hex string into a vec4
    col = (c: string): [number, number, number, number] => {
        const values = c
            .replace('#', '')
            .match(c.length < 5 ? /./g : /../g)!
            .map((a) => +('0x' + a) / (c.length < 5 ? 15 : 255));
        return [...values, 1] as [number, number, number, number];
    }; // rgb / rgba / rrggbb / rrggbbaa

    // Add a new 3D model
    add = (name: string, objects) => {
        this.models[name] = objects;
        if (objects.normals) {
            this.models[name].customNormals = 1;
        }
    };

    instance = (t: objectState, type: string) => this.setState(t, type);

    toEuler = (q: any) => {
        const x = Math.atan2(2 * (q.w * q.x + q.y * q.z), 1 - 2 * (q.x * q.x + q.y * q.y));
        const y = Math.asin(2 * (q.w * q.y - q.z * q.x));
        const z = Math.atan2(2 * (q.w * q.z + q.x * q.y), 1 - 2 * (q.y * q.y + q.z * q.z));
        return {x, y, z};
    };

    /**
     * Applies rotations from a Quaternion to a vector.
     * @param v The vector to rotate.
     * @param q The quaternion to apply.
     * @returns The rotated vector.
     */
    applyQuaternion(v: number[], q: {x: number; y: number; z: number; w: number}): number[] {
        // Calculate quat * vector
        const ix = q.w * v[0] + q.y * v[2] - q.z * v[1];
        const iy = q.w * v[1] + q.z * v[0] - q.x * v[2];
        const iz = q.w * v[2] + q.x * v[1] - q.y * v[0];
        const iw = -q.x * v[0] - q.y * v[1] - q.z * v[2];

        // Calculate result * inverse quat
        return [
            ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y,
            iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z,
            iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x,
        ];
    }

    createGroup = (t: objectState) => this.setState(t, 'group');

    move = (t: objectState, delay = 1) =>
        setTimeout(() => {
            this.setState(t);
        }, delay);

    delete = (n: string, delay = 1) =>
        setTimeout(() => {
            delete this.next[n];
        }, delay);

    light = (t: objectState, delay = undefined) =>
        delay
            ? setTimeout(() => {
                  this.setState(t, (t.n = 'light'));
              }, delay)
            : this.setState(t, (t.n = 'light'));
    private _definePlane() {
        this.add('plane', {
            vertices: [0.5, 0.5, 0, -0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0],

            uv: [1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0],
        });
    }

    private _defineCube() {
        this.add('cube', {
            vertices: [
                0.5,
                0.5,
                0.5,
                -0.5,
                0.5,
                0.5,
                -0.5,
                -0.5,
                0.5, // front
                0.5,
                0.5,
                0.5,
                -0.5,
                -0.5,
                0.5,
                0.5,
                -0.5,
                0.5,
                0.5,
                0.5,
                -0.5,
                0.5,
                0.5,
                0.5,
                0.5,
                -0.5,
                0.5, // right
                0.5,
                0.5,
                -0.5,
                0.5,
                -0.5,
                0.5,
                0.5,
                -0.5,
                -0.5,
                0.5,
                0.5,
                -0.5,
                -0.5,
                0.5,
                -0.5,
                -0.5,
                0.5,
                0.5, // up
                0.5,
                0.5,
                -0.5,
                -0.5,
                0.5,
                0.5,
                0.5,
                0.5,
                0.5,
                -0.5,
                0.5,
                0.5,
                -0.5,
                0.5,
                -0.5,
                -0.5,
                -0.5,
                -0.5, // left
                -0.5,
                0.5,
                0.5,
                -0.5,
                -0.5,
                -0.5,
                -0.5,
                -0.5,
                0.5,
                -0.5,
                0.5,
                -0.5,
                0.5,
                0.5,
                -0.5,
                0.5,
                -0.5,
                -0.5, // back
                -0.5,
                0.5,
                -0.5,
                0.5,
                -0.5,
                -0.5,
                -0.5,
                -0.5,
                -0.5,
                0.5,
                -0.5,
                0.5,
                -0.5,
                -0.5,
                0.5,
                -0.5,
                -0.5,
                -0.5, // down
                0.5,
                -0.5,
                0.5,
                -0.5,
                -0.5,
                -0.5,
                0.5,
                -0.5,
                -0.5,
            ],
            uv: [
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
        });
    }
}
