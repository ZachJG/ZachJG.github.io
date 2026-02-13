import FilteredRender from "../classes/filteredRenderer.js"
import StandardTextObject from "../classes/textObject.js";

async function init() {
    // Create a canvas tag
    const canvasTag = document.createElement('canvas');
    canvasTag.id = "renderCanvas";
    document.body.appendChild(canvasTag);

    // Create a simple renderer
    const renderer = new FilteredRender(canvasTag);
    await renderer.init();

    let fps = '??';
    var fpsText = new StandardTextObject('fps: ' + fps);
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case 'f': case 'F': fpsText.toggleVisibility(); break;
      }
    });
    var frameCnt = window.frames.length % 60
    fpsText.updateText('fps: ' + frameCnt);

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