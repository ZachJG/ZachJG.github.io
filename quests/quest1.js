import Renderer from "../classes/renderer2d.js";
import TriangleShape from "../shapes/triangleShape.js";

async function init() {
  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);

  // Create a simple renderer
  const renderer = new Renderer(canvasTag);
  await renderer.init();

  // Append objects
  let vert = new Float32Array([
    // x, y
    -0.9, -0.3,
    -0.6, -0.9,
    -0.3,  -0.9
  ]);
  let color = new Float32Array([
    255,0,
    0,1
  ]);
  let triangle = new TriangleShape(renderer._device,renderer._canvasFormat,vert,color);
  await renderer.appendSceneObject(triangle);
  let color1 = new Float32Array([
    194,234,
    18,1
  ]);
  let vertS = new Float32Array([
    // x, y
    0.25, 0.5,
    0.25, 0.25,
    0.5,  0.5,
    0.5, 0.25,
    0.25, 0.25,
    0.5,  0.5
  ]);
  let square = new TriangleShape(renderer._device,renderer._canvasFormat,vertS,color1);
  await renderer.appendSceneObject(square);
  let color2 = new Float32Array([
    78,32,134,1
  ]);
  let vertSt = new Float32Array([
    // x, y
    -0.1,0.1,
    -0.12,0.05,
    -0.08,0.05,
    -0.12,0.05,
    -0.12,0.01,
    -0.17,0.03,
    -0.08,0.05,
    -0.08,0.01,
    -0.03,0.03
  ]);
  let star = new TriangleShape(renderer._device,renderer._canvasFormat,vertSt,color2);
  await renderer.appendSceneObject(star);

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