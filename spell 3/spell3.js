import Standard2DFullScreenObject from "../classes/standard2dFullScreenObject.js";

let shaderCode = await this.loadShader("../shaders/fullScreenTexture.wgsl");

await renderer.appendSceneObject(new Standard2DFullScreenObject(renderer._device, renderer._canvasFormat, "../assets/<an image file>"));
