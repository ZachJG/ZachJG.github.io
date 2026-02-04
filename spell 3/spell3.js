import FilteredRenderer from "../classes/filteredRenderer.js";
import Standard2DFullScreenObject from "../classes/standard2dFullScreenObject.js";
import ImageNosifyFilterObject from "../classes/imageNosify.js";
import Standard2DGAPosedVertexObject from "../classes/standard2dPose.js";

let applyRotorToRotor = (dr, r) => {
  // r = cS + s exey
  // dr = ccS + ss exey
  // dr r = (c * cc - s * ss)S + (cc * s + ss * s) e01
  return [dr[0] * r[0] - dr[1] * r[1], dr[0] * r[1] + dr[1] * r[0]];
};

const canvasTag = document.createElement('canvas');
const renderer = new FilteredRenderer(canvasTag);
var pose = [1, 0, 0, 0, 1, 1]; // rotor, translator, scales
pose = new Float32Array(pose);
let angle = Math.PI / 100 / 2;
let dr = [Math.cos(angle), -Math.sin(angle)]; // a delta rotor

async function init() {
  // Create a canvas tag
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);

  // Create a simple renderer
  await renderer.init();

  await renderer.appendSceneObject(new Standard2DFullScreenObject(renderer._device, renderer._canvasFormat, "../assets/boatgoesbinted.jpg"));
  await renderer.appendFilterObject(new ImageNosifyFilterObject(renderer._device, renderer._canvasFormat, "../shaders/nosify.wgsl"));

  await renderer.appendSceneObject(new Standard2DGAPosedVertexObject(renderer._device, renderer._canvasFormat, vertices, pose, "../shaders/gaposer.wgsl", "triangle-list"));

  // Render
  renderer.render();
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

setInterval(() => { 
  renderer.render();
  // update pose
  let newrotor = applyRotorToRotor(dr, [pose[0], pose[1]]);
  pose[0] = newrotor[0];
  pose[1] = newrotor[1];
}, 100); // call every 100 ms