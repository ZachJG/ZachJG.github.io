import TrianglePGA from "../shapes/trianglepga.js";
import Renderer from "../classes/renderer2d.js";
import PGA2D from "../classes/pga2d.js";
import StandardTextObject from "../classes/textObject.js";

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
      1, 0, 0.25, 0.25, 1, 1
    ]),
    new Float32Array([
      255,0,0,1
    ]),
    new Float32Array([
      -0.05,-0.05,0.075,0.075
    ])
  );
  let npc2 = new TrianglePGA(
    renderer._device,
    renderer._canvasFormat,
    new Float32Array([
      0,0.05,-0.05,0,0.05,0
    ]),
    new Float32Array([
      1, 0, -0.25, 0.25, 1, 1
    ]),
    new Float32Array([
      255,0,0,1
    ]),
    new Float32Array([
      -0.05,-0.05,0.075,0.075
    ])
  );
  let npc3 = new TrianglePGA(
    renderer._device,
    renderer._canvasFormat,
    new Float32Array([
      0,0.05,-0.05,0,0.05,0
    ]),
    new Float32Array([
      1, 0, 0.25, -0.25, 1, 1
    ]),
    new Float32Array([
      255,0,0,1
    ]),
    new Float32Array([
      -0.05,-0.05,0.075,0.075
    ])
  );
  let npc4 = new TrianglePGA(
    renderer._device,
    renderer._canvasFormat,
    new Float32Array([
      0,0.05,-0.05,0,0.05,0
    ]),
    new Float32Array([
      1, 0, -0.25, -0.25, 1, 1
    ]),
    new Float32Array([
      255,0,0,1
    ]),
    new Float32Array([
      -0.05,-0.05,0.075,0.075
    ])
  );
  await renderer.appendSceneObject(npc1);
  await renderer.appendSceneObject(npc2);
  await renderer.appendSceneObject(npc3);
  await renderer.appendSceneObject(npc4);
  let dialogue = new StandardTextObject('');
  var talking = false;
  
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W':
        if (!talking) {
          player.moveUp(speed);
        }
        break;
      case 'ArrowDown': case 's': case 'S':  
        if (!talking) {
          player.moveDown(speed);
        }
        break;
      case 'ArrowLeft': case 'a': case 'A':
        if (!talking) {
          player.moveLeft(speed);
        }
        break;
      case 'ArrowRight': case 'd': case 'D':
        if (!talking) {
          player.moveRight(speed);
        }
        break;
      case 'e': case 'E':
        if (player._collision,npc1._collision) {
          talking = !talking;
          if (talking) {
            dialogue.updateText('I like to wear shorts. They are comfy.');
            dialogue.updateTextRegion('I like to wear shorts. They are comfy.');
          } else {
            dialogue.updateText('');
            dialogue.updateTextRegion('');
          }
        }
        if (player._collision,npc2._collision) {
          talking = !talking;
          if (talking) {
            dialogue.updateText('Welcome to Triangle Town.');
            dialogue.updateTextRegion('Welcome to Triangle Town.');
          } else {
            dialogue.updateText('');
            dialogue.updateTextRegion('');
          }
        }
        if (player._collision,npc3._collision) {
          talking = !talking;
          if (talking) {
            dialogue.updateText('Do not follow your dreams, find something to get comfortable in.');
            dialogue.updateTextRegion('Do not follow your dreams, find something to get comfortable in.');
          } else {
            dialogue.updateText('');
            dialogue.updateTextRegion('');
          }
        }
        if (player._collision,npc4._collision) {
          talking = !talking;
          if (talking) {
            dialogue.updateText('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
            dialogue.updateTextRegion('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
          } else {
            dialogue.updateText('');
            dialogue.updateTextRegion('');
          }
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
  var secPerFrame = 1 / tgtFPS;
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