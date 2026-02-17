import FilteredRender from "../classes/filteredRenderer.js"
import StandardTextObject from "../classes/textObject.js";
import Camera from "../classes/camera.js";
import Grid from "../classes/grid.js";
import PGA2D from "../classes/pga2d.js";

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
    var quad = new Grid(renderer._device, renderer._canvasFormat, camera._pose, vertices, "../shaders/grid.wgsl", "line-strip", 10 * 10); // draw 10*10 instances
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
    canvasTag.addEventListener('mousemove', (e) => {
      var mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      var mouseY = (-e.clientY / window.innerHeight) * 2 + 1;
      mouseX /= camera._pose[4];
      mouseY /= camera._pose[5];
      let p = PGA2D.applyMotorToPoint([mouseX, mouseY], [camera._pose[0], camera._pose[1], camera._pose[2], camera._pose[3]]);
      let halfLength = 1; // half length
      let cellLength = halfLength * 2; // full length
      let u = Math.floor((p[0] + halfLength) / cellLength * 10);
      let v = Math.floor((p[1] + halfLength) / cellLength * 10);
      if (u >= 0 && u < 10 && v >= 0 && v < 10) {
        let offsetX = - halfLength + u / 10 * cellLength + cellLength / 10 * 0.5;
        let offsetY = - halfLength + v / 10 * cellLength + cellLength / 10 * 0.5;
        if (-0.5 / 10 + offsetX <= p[0] && p[0] <= 0.5 / 10 + offsetX && -0.5 / 10 + offsetY <= p[1] && p[1] <= 0.5 / 10 + offsetY) {
          console.log(`in cell (${u}, ${v})`);
        }
      }
      console.log(`Closest offset is (${u}, ${v})`);
    });
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