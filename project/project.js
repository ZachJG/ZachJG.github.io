import TrianglePGA from "../shapes/trianglepga.js";
import Renderer from "../classes/renderer2d.js";
import PGA2D from "../classes/pga2d.js";

async function init() {
  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);

  // Create a simple renderer
  const renderer = new Renderer(canvasTag);
  await renderer.init();
  let vert = new Float32Array([
    0, 0.025, 
    -0.025, 0,
    0.025,  0,
  ]);
  let col = new Float32Array([
    100,200,50,1
  ]);
  var speed = 0.01
  var pose = new Float32Array([1, 0, 0, 0, 1, 1]);
  let player = new TrianglePGA(renderer._device,renderer._canvasFormat,vert,pose,col);
  await renderer.appendSceneObject(player);
  
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W':
        if (player._pose[3] < 0.75) {
          player.moveUp(speed);
        }
        break;
      case 'ArrowDown': case 's': case 'S':  
        if (player._pose[3] > -0.75) {
          player.moveDown(speed);
        }
        break;
      case 'ArrowLeft': case 'a': case 'A':
        if (player._pose[2] > -0.75) {
          player.moveLeft(speed);
        }
        break;
      case 'ArrowRight': case 'd': case 'D':
        if (player._pose[2] < 0.75) {
          player.moveRight(speed);
        }
        break;
    }
  });
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