import Renderer from "./classes/renderer2d.js";
import SmallTriangle from "./shapes/smallTriangle.js";
import Square from "./shapes/square.js";

async function init() {
  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);

  // Create a simple renderer
  const renderer = new Renderer(canvasTag);
  await renderer.init();

  // Append objects
  await renderer.appendSceneObject(new SmallTriangle(renderer._device, renderer._canvasFormat));
  await renderer.appendSceneObject(new Square(renderer._device, renderer._canvasFormat));

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