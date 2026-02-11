import FilteredRenderer from "../classes/filteredRenderer.js";
import Standard2DFullScreenObject from "../classes/standard2dFullScreenObject.js";
import Camera from "../classes/camera.js";
import Camera2DVertexObject from "../classes/cameraVertexObject.js";

function mouseToNDC(e) {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (-e.clientY / window.innerHeight) * 2 + 1;
    return [x, y];
}

async function init() {
    // Create a canvas tag
    const canvasTag = document.createElement('canvas');
    canvasTag.id = "renderCanvas";
    document.body.appendChild(canvasTag);

    // Create a simple renderer
    const renderer = new FilteredRenderer(canvasTag);
    await renderer.init();

    await renderer.appendSceneObject(new Standard2DFullScreenObject(renderer._device, renderer._canvasFormat, "../assets/boatgoesbinted.jpg"));
    let camera = new Camera();
    let triangle = new Camera2DVertexObject(renderer._device, renderer._canvasFormat, camera._pose, new Float32Array([0, 0.5, -0.5, 0, 0.5, 0]), "../shaders/camera.wgsl");
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
    var movespeed = 0.05;
    window.addEventListener("keydown", (e) => {
        switch (e.key) {
            case 'ArrowUp': case 'w': case 'W':
                camera.moveUp(movespeed);
                triangle.updateCameraPose();
                break;
            case 'ArrowDown': case 's': case 'S':   
                camera.moveDown(movespeed);
                triangle.updateCameraPose();     
                break;
            case 'ArrowLeft': case 'a': case 'A':  
                camera.moveLeft(movespeed);
                triangle.updateCameraPose();
                break;
            case 'ArrowRight': case 'd': case 'D': 
                camera.moveRight(movespeed);
                triangle.updateCameraPose();       
                break;
            case 'q': case 'Q':  
                camera.zoomIn();
                triangle.updateCameraPose();       
                break;
            case 'e': case 'E':
                camera.zoomOut();
                triangle.updateCameraPose();  
                break;
        }
    });
    let dragging = false;            // are we currently dragging?
    let prevP = { x: 0, y: 0 };
    canvasTag.addEventListener('mousemove', (e) => {
        // tracking/update logic
        if (!dragging) return;
        const ndc = mouseToNDC(e);
        const dx = ndc[0] - prevP.x;
        const dy = ndc[1] - prevP.y;
        prevP.x = ndc[0];
        prevP.y = ndc[1];
        // Note: we apply the opposite direction to make the mouse movement align with the object
        if (dx > 0) camera.moveRight(-dx);
        else camera.moveLeft(dx);
        if (dy > 0) camera.moveUp(-dy);
        else camera.moveDown(dy);
        triangle.updateCameraPose();
        renderer.render();
    });
    canvasTag.addEventListener('mousedown', (e) => {
        dragging = true;
        // init tracking/update logic
        // 1) mouse -> scene
        const ndc = mouseToNDC(e);
        // 2) store previous location
        prevP.x = ndc[0];
        prevP.y = ndc[1];
    });

    canvasTag.addEventListener('mouseup', (e) => {
        dragging = false;
    });

    canvasTag.addEventListener('mouseleave', (e) => {
        dragging = false;
    });
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