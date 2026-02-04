import FilteredRenderer from "../classes/filteredRenderer.js";
import Standard2DFullScreenObject from "../classes/standard2dFullScreenObject.js";
import ImageNosifyFilterObject from "../classes/imageNosify.js";
import Standard2DGAPosedVertexObject from "../classes/standard2dPose.js"

async function init() {
  let applyRotorToRotor = (dr, r) => {
    // r = cS + s exey
    // dr = ccS + ss exey
    // dr r = (c * cc - s * ss)S + (cc * s + ss * s) e01
    return [dr[0] * r[0] - dr[1] * r[1], dr[0] * r[1] + dr[1] * r[0]];
  };
  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);

  // Create a simple renderer
  const renderer = new FilteredRenderer(canvasTag);
  await renderer.init();

  await renderer.appendSceneObject(new Standard2DFullScreenObject(renderer._device, renderer._canvasFormat, "../assets/boatgoesbinted.jpg"));
  await renderer.appendFilterObject(new ImageNosifyFilterObject(renderer._device, renderer._canvasFormat, "../shaders/nosify.wgsl"));

  let vertices = new Float32Array([
    // x, y
    0, 0.5,
    -0.5, 0,
    0.5,  0,
    0, 0.5
  ]);
  var pose = new Float32Array([
    1, 0,     // rotor
    0, 0,     // translator
    1, 1,     // scale
    0, 0.5    // r_center
  ]);
  await renderer.appendSceneObject(new Standard2DGAPosedVertexObject(renderer._device, renderer._canvasFormat, vertices, pose, "../shaders/gaposer.wgsl", "triangle-list"));
  let angle = Math.PI / 100 / 2;
  let dr = [Math.cos(angle), -Math.sin(angle)]; // a delta rotor
  // Render
  setInterval(() => { 
    renderer.render();
    // update pose
    let newrotor = applyRotorToRotor(dr, [pose[0], pose[1]]);
    pose[0] = newrotor[0];
    pose[1] = newrotor[1];
  }, 100); // call every 100 ms
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

