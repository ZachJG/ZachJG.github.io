import Standard2DFullScreenObject from "../classes/standard2dFullScreenObject.js";
import ImageFilterObject from "../classes/imageFilterObject.js";
import ImageNosifyFilterObject from "../classes/imageNosify.js";

let shaderCode = await this.loadShader("../shaders/fullScreenTexture.wgsl");

await renderer.appendSceneObject(new Standard2DFullScreenObject(renderer._device, renderer._canvasFormat, "../assets/boatgoesbinted.jpg"));

await renderer.appendFilterObject(new ImageFilterObject(renderer._device, renderer._canvasFormat, "../shaders/8bit.wgsl"));

await renderer.appendFilterObject(new ImageNosifyFilterObject(renderer._device, renderer._canvasFormat, "../shaders/nosify.wgsl"));
