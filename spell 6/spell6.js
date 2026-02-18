import FilteredRender from "../classes/filteredRenderer.js";
import Camera from "../classes/camera.js";
import ParticleSystemObject from "../classes/particle.js";

async function init() {
    // Create a canvas tag
    const canvasTag = document.createElement('canvas');
    canvasTag.id = "renderCanvas";
    document.body.appendChild(canvasTag);

    // Create a simple renderer
    const renderer = new FilteredRender(canvasTag);
    await renderer.init();

    let camera = new Camera();
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