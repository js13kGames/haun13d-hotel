import {GL} from '../lib/GL';
import {InputSystem} from '../lib/InputSystem';
import {PlayerController} from '../lib/PlayerController';
import {Scene} from '../lib/Scene';
import {WebGLRenderer} from '../lib/WebGLRenderer';

new EventSource('/esbuild').addEventListener('change', () => location.reload());

export class Game {
    renderer: WebGLRenderer;
    scene: Scene;
    inputSystem: InputSystem;
    player: PlayerController;
    webglCanvas: HTMLCanvasElement;
    gl: WebGL2RenderingContext;
    xrButton: HTMLButtonElement | undefined;
    xrSession: XRSession | undefined;
    xrRefSpace: XRReferenceSpace | undefined;
    constructor() {
        // Main game setup

        this.scene = new Scene();
        this.inputSystem = new InputSystem();
        this.player = new PlayerController();
        this.scene.addObject(this.player);

        console.log('Game started');

        this.webglCanvas = document.createElement('canvas');
        // Create a WebGL context to render with, initialized to be compatible
        // with the XRDisplay we're presenting to.
        this.gl = this.webglCanvas.getContext('webgl2', {
            xrCompatible: true,
            alpha: false,
        })!;

        this.renderer = new WebGLRenderer(this.gl);

        this.initXR();
    }

    /**
     * Checks to see if WebXR is available and, if so, queries a list of
     * XRDevices that are connected to the system.
     */
    initXR() {
        // Adds a helper button to the page that indicates if any XRDevices are
        // available and let's the user pick between them if there's multiple.
        this.xrButton = document.getElementById('xr-button') as HTMLButtonElement;

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
    }
    /**
     *  Called when the user selects a device to present to. In response we
     * will request an exclusive session from that device.
     */
    onRequestSession() {
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

    /**
     * Called every time the XRSession requests that a new frame be drawn.
     */
    onXRFrame(t: DOMHighResTimeStamp, frame: XRFrame) {
        let session = frame.session;
        // initialize prevTime on the first run
        if (this.prevTime === null) {
            this.prevTime = t;
            session.requestAnimationFrame(this.onXRFrame.bind(this));
            return; // skip further execution for this frame
        }

        const deltaTime = (t - this.prevTime) / 1000;
        this.prevTime = t;
        // Per-frame scene setup. Nothing WebXR specific here.
        //scene.startFrame();
        // Inform the session that we're ready for the next frame.
        session.requestAnimationFrame(this.onXRFrame.bind(this));

        // Get the XRDevice pose relative to the Frame of Reference we created
        // earlier.
        let pose = frame.getViewerPose(this.xrRefSpace!);

        // this.inputSystem.poll();
        // this.player.update(); //this.inputSystem;
        this.scene.update(deltaTime);
        // this.scene.render(this.renderer);

        // Getting the pose may fail if, for example, tracking is lost. So we
        // have to check to make sure that we got a valid pose before attempting
        // to render with it. If not in this case we'll just leave the
        // framebuffer cleared, so tracking loss means the scene will simply
        // disappear.
        if (pose) {
            let glLayer = session.renderState.baseLayer!;

            // If we do have a valid pose, bind the WebGL layer's framebuffer,
            // which is where any content to be displayed on the XRDevice must be
            // rendered.
            this.gl.bindFramebuffer(GL.FRAMEBUFFER, glLayer.framebuffer);

            // Clear the framebuffer
            this.gl.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

            this.renderer.clear([0.1, 0.1, 0.1, 1]);

            this.scene.updateInputSources(frame, this.xrRefSpace);

            this.renderer.render(this.scene);
        }
    }
}
