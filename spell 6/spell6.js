import FilteredRender from "../classes/filteredRenderer.js";
import Camera from "../classes/camera.js";
import ParticleSystemObject from "../classes/particle.js";
import StandardTextObject from "../classes/textObject.js";

async function init() {
    // Create a canvas tag
    const canvasTag = document.createElement('canvas');
    canvasTag.id = "renderCanvas";
    document.body.appendChild(canvasTag);

    // Create a simple renderer
    const renderer = new FilteredRender(canvasTag);
    await renderer.init();
    
    let particles = new ParticleSystemObject(renderer._device,renderer._canvasFormat,"../shaders/particles.wgsl",128);
    await renderer.appendSceneObject(particles);

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
        particles.resetParticles();
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