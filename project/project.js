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
    0.025,  0
  ]);
  let col = new Float32Array([
    100,200,50,1
  ]);
  let shap = new Float32Array([
    -0.025,-0.025,0.05,0.05
  ]);
  var speed = 0.01
  var pose = new Float32Array([1, 0, 0, 0, 1, 1]);
  let player = new TrianglePGA(renderer._device,renderer._canvasFormat,vert,pose,col,shap);
  await renderer.appendSceneObject(player);
  
  let npc1 = new TrianglePGA(
    renderer._device,
    renderer._canvasFormat,
    new Float32Array([
      0,0.05,-0.05,0,0.05,0
    ]),
    new Float32Array([
      1, 0, 0.5, 0.5, 1, 1
    ]),
    new Float32Array([
      255,0,0,1
    ]),
    new Float32Array([
      -0.05,-0.05,0.075,0.075
    ])
  );
  
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W':
        player.moveUp(speed);
        break;
      case 'ArrowDown': case 's': case 'S':  
        player.moveDown(speed);
        break;
      case 'ArrowLeft': case 'a': case 'A':
        player.moveLeft(speed);
        break;
      case 'ArrowRight': case 'd': case 'D':
        player.moveRight(speed);
        break;
      case 'e': case 'E':
        if (player._collision,npc1._collision) {
          print("touch")
        }
        break;
    }
  });
  /*window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W': case 'ArrowDown': case 's': case 'S': case 'ArrowLeft': case 'a': case 'A': case 'ArrowRight': case 'd': case 'D':
        console.log(player._pose[2]+vert[0]);
        console.log(player._pose[2]+vert[2]);
        console.log(player._pose[2]+vert[4]);
        console.log(player._pose[3]+vert[1]);
        console.log(player._pose[3]+vert[3]);
        console.log(player._pose[3]+vert[5]);
        break;
    }
  });*/
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