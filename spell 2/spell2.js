import Renderer from "../classes/renderer2d.js";
import Triangle1 from "../shapes/triangle1.js";
import Triangle2 from "../shapes/triangle2.js";

async function init() {
  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);

  // Create a simple renderer
  const renderer = new Renderer(canvasTag);
  await renderer.init();

  // Append objects
  await renderer.appendSceneObject(new Triangle1(renderer._device, renderer._canvasFormat));
  await renderer.appendSceneObject(new Triangle2(renderer._device, renderer._canvasFormat));

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