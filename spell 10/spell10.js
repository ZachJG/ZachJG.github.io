import FilteredRender from "../classes/filteredRenderer.js";
import Camera from "../classes/camera.js";
import StandardTextObject from "../classes/textObject.js";
import PGA3D from "../classes/pga3d.js";

async function init() {
    // Create a canvas tag
    const canvasTag = document.createElement('canvas');
    canvasTag.id = "renderCanvas";
    document.body.appendChild(canvasTag);

    // Create a simple renderer
    const renderer = new FilteredRender(canvasTag);
    await renderer.init();

    // define a 3D point
    let p = [0, 0, 0]; 
    // create a translator
    let dt = PGA3D.createTranslator(0, 0, -1); 
    // apply the translator twice
    let pga_result = PGA3D.applyMotorToPoint(p, dt);
    pga_result = PGA3D.applyMotorToPoint(pga_result, dt);
    // check the result. You should see (0, 0, -2) in the console
    console.log(pga_result.map(val => val.toFixed(4))); 

    // define a pose for this point object
    let pose = new Float32Array(Array(16).fill(0)); 
    pose[0] = 1;
    // create a translator
    let poset = PGA3D.createTranslator(1, 3, 2); 
    // accumulate the translator to the pose
    let cpose = PGA3D.geometricProduct(poset, pose);
    // apply the pose
    let check = PGA3D.applyMotorToPoint(p, cpose);
    // check the result. You should see (1, 3, 2) in the console
    console.log(check.map(val => val.toFixed(4))); 
    // apply dt to the pose twice
    cpose = PGA3D.geometricProduct(cpose, dt);
    cpose = PGA3D.geometricProduct(cpose, dt);
    // apply the pose
    check = PGA3D.applyMotorToPoint(p, cpose);
    // check the result. You should see (1, 3, 0) in the console
    console.log(check.map(val => val.toFixed(4))); 

    let camera = new Camera();
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