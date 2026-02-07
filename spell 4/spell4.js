import FilteredRenderer from "../classes/filteredRenderer.js";
import Camera from "../classes/camera.js";
import Camera2DVertexObject from "../classes/cameraVertexObject.js";
import Triangle1 from "../shapes/triangle1.js";

async function init() {
    // Create a canvas tag
    const canvasTag = document.createElement('canvas');
    canvasTag.id = "renderCanvas";
    document.body.appendChild(canvasTag);

    // Create a simple renderer
    const renderer = new FilteredRenderer(canvasTag);
    await renderer.init();

    await renderer.appendSceneObject(new Triangle1(renderer._device, renderer._canvasFormat));

    let camera = new Camera();
    let triangle = new Camera2DVertexObject(renderer._device, renderer._canvasFormat, camera._pose, new Float32Array([0, 0.5, -0.5, 0, 0.5, 0]), "<your new shader file>");
    await renderer.appendSceneObject(triangle);

    // run animation at 60 fps
    var frameCnt = 0;
    var tgtFPS = 60;
    var secPerFrame = 1. / tgtFPS;
    var frameInterval = secPerFrame * 1000;
    var lastCalled;
    let renderFrame = () => {
        let elapsed = Date.now() - lastCalled;
        if (elapsed > frameInterval) {
            ++frameCnt;
            lastCalled = Date.now() - (elapsed % frameInterval);
            renderer.render();
        }
        requestAnimationFrame(renderFrame);
    };
    lastCalled = Date.now();
    renderFrame();
    setInterval(() => { 
        console.log(frameCnt);
        frameCnt = 0;
    }, 1000); // call every 1000 ms
    return renderer;
}

init().then( ret => {
    console.log(ret);
}).catch( error => {
    const pTag = document.createElement('p');
    pTag.innerHTML = navigator.userAgent + "</br>" + error.message;
    document.body.appendChild(pTag);
    document.getElementById("renderCanvas").remove();
});