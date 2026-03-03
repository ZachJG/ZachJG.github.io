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

    let camera = new Camera();

    /*
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
    console.log(check.map(val => val.toFixed(4)));*/

    /*
    // define a 3D point
    let p = [1, 0, 0]; 
    // create a rotor rotating around (1, 0, 0) by 90 degrees
    let dr = PGA3D.createRotor(Math.PI / 2, 1, 0, 0); // note, the passing through point is defaulted to (0, 0, 0)
    // this rotates (1, 0, 0) by 90 degrees around (1, 0, 0)
    let pga_result = PGA3D.applyMotorToPoint(p, dr); 
    // check the result. You should see (1, 0, 0) in the console. Well, (1, 0, 0) is on the rotation axis, so it shouldn't move.
    console.log(pga_result.map(val => val.toFixed(4))); */

    /*
    // define a 3D point
    p = [1, 1, 1]; 
    // create a rotor rotating around (1, 0, -1) by 180 degrees
    dr = PGA3D.createRotor(Math.PI, 1, 0, -1); 
    // create a translator by (1, 0, 0)
    let dt = PGA3D.createTranslator(1, 0, 0); 
    // combine them to a motor
    let dm = PGA3D.geometricProduct(dt, dr);
    // the below should be an identity - this tells you that the reverse always cancel the transform
    console.log(PGA3D.geometricProduct(PGA3D.reverse(dm), dm).map(val => val.toFixed(4))); 
    // this rotates (1, 1, 1) by 180 degrees around (1, 0, -1) then translates by (1, 0, 0)
    let pga_result = PGA3D.applyMotorToPoint(p, dm); 
    // check the result. You should see (0, -1, -1) in the console
    console.log(pga_result.map(val => val.toFixed(4))); 
    // now, try to apply it one by one
    let test = PGA3D.applyMotorToPoint(p, dr);
    let g = PGA3D.applyMotorToPoint(test, dt);
    // this should be the same
    console.log(g.map(val => val.toFixed(4)));*/

    // let our starting point be (0, 1, 0) - (a point on a circle)
    let p = [0, 1, 0]; 
    // the starting pose, which is an identity
    let pose = PGA3D.createTranslator(0, 0, 0); 
    // our starting x value - the input to the sine function
    let theta = 0; 
    // the input of the sine function is our x, so the delta changes is the dx
    let dx = Math.PI / 100; 

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
      // find the delta translator using the helix formula, we are using (t, cos(t), sin(t));
      let new_theta = theta + dx; // compute a new x
      let dy = Math.cos(new_theta) - Math.cos(theta); // compute dy by new y - old y
      let dz = Math.sin(new_theta) - Math.sin(theta); // compute dy by new z - old z
      // create a translator using (dx, dy, dz)
      let dt = PGA3D.createTranslator(dx, dy, dz);
      // accumulate it to the pose
      pose = PGA3D.geometricProduct(dt, pose); 
      // apply the pose to get the current position
      let pga_result = PGA3D.applyMotorToPoint(p, pose); 
      // check the result, you should see x keeps increasing while y is moving up and down, forming a sine wave
      console.log(pga_result.map(val => val.toFixed(4))); 
      // update the current x
      theta = new_theta; 
      fpsText.updateText('fps: ' + frameCnt);
      frameCnt = 0;
    }, 100); // call every 1000 ms
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