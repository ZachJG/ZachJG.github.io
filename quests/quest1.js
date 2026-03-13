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
    1.0, 0.0, 0.0, 1.0
  ])
  let triangle = new TriangleShape(renderer._device,renderer._canvasFormat,vert,color);
  await renderer.appendSceneObject(triangle);
  let vertS1 = new Float32Array([
    // x, y
    0.25, 0.5,
    0.25, 0.25,
    0.5,  0.5
  ]);
  let square1 = new TriangleShape(renderer._device,renderer._canvasFormat,vertS1,color);
  await renderer.appendSceneObject(square1);
  let vertS2 = new Float32Array([
    0.5, 0.25,
    0.25, 0.25,
    0.5,  0.5
  ]);
  let square2 = new TriangleShape(renderer._device,renderer._canvasFormat,vertS2,color);
  await renderer.appendSceneObject(square2);


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