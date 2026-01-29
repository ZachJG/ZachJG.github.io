import Renderer from "../classes/renderer2d.js";
import Standard2DFullScreenObject from "../classes/standard2dFullScreenObject.js";


async function init() {
  // Create a canvas tag
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas";
  document.body.appendChild(canvasTag);

  // Create a simple renderer
  const renderer = new Renderer(canvasTag);
  await renderer.init();

  let shaderCode = await this.loadShader("../shaders/fullscreenTexture.wgsl");

  await renderer.appendSceneObject(new Standard2DFullScreenObject(renderer._device, renderer._canvasFormat, "../assets/boatgoesbinted.jpg"));


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