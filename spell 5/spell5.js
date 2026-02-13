import FilteredRender from "../classes/filteredRenderer.js"
import StandardTextObject from "../classes/textObject.js";
import Camera from "../classes/camera.js";
import Camera2DVertexObject from "../classes/cameraVertexObject.js";

async function init() {
    // Create a canvas tag
    const canvasTag = document.createElement('canvas');
    canvasTag.id = "renderCanvas";
    document.body.appendChild(canvasTag);

    // Create a simple renderer
    const renderer = new FilteredRender(canvasTag);
    await renderer.init();

    let camera = new Camera();
    var vertices = new Float32Array([
      // x, y
      -0.5, -0.5,
      0.5, -0.5,
      0.5,  0.5,
      -0.5, 0.5, 
      -0.5, -0.5 // loop back to the first vertex
    ]);
    var quad = new Camera2DVertexObject(renderer._device, renderer._canvasFormat, camera._pose, vertices, "../shaders/camera2.wgsl", "line-strip", 10 * 10); // draw 10*10 instances
    await renderer.appendSceneObject(quad);

    let fps = '??';
    var fpsText = new StandardTextObject('fps: ' + fps);
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case 'f': case 'F': fpsText.toggleVisibility(); break;
      }
    });
    var frameCnt = 0
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
      fpsText.updateText('fps: ' + frameCnt);
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