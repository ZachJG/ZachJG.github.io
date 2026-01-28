import Standard2DFullScreenObject from "../classes/standard2dFullScreenObject.js";
import ImageFilterObject from "../classes/imageFilterObject.js";
import ImageNosifyFilterObject from "../classes/imageNosify.js";
import Standard2DGAPosedVertexObject from "../classes/standard2dPose.js";

let shaderCode = await this.loadShader("../shaders/fullScreenTexture.wgsl");

await renderer.appendSceneObject(new Standard2DFullScreenObject(renderer._device, renderer._canvasFormat, "../assets/boatgoesbinted.jpg"));

await renderer.appendFilterObject(new ImageFilterObject(renderer._device, renderer._canvasFormat, "../shaders/8bit.wgsl"));

await renderer.appendFilterObject(new ImageNosifyFilterObject(renderer._device, renderer._canvasFormat, "../shaders/nosify.wgsl"));

let applyRotorToRotor = (dr, r) => {
    // r = cS + s exey
    // dr = ccS + ss exey
    // dr r = (c * cc - s * ss)S + (cc * s + ss * s) e01
    return [dr[0] * r[0] - dr[1] * r[1], dr[0] * r[1] + dr[1] * r[0]];
};

var pose = [1, 0, 0, 0, 1, 1]; // rotor, translator, scales
pose = new Float32Array(pose);
await renderer.appendSceneObject(new Standard2DGAPosedVertexObject(renderer._device, renderer._canvasFormat, vertices, pose, "../shaders/gaposer.wgsl", "triangle-list"));
let angle = Math.PI / 100 / 2;
let dr = [Math.cos(angle), -Math.sin(angle)]; // a delta rotor

setInterval(() => { 
    renderer.render();
    // update pose
    let newrotor = applyRotorToRotor(dr, [pose[0], pose[1]]);
    pose[0] = newrotor[0];
    pose[1] = newrotor[1];
}, 100); // call every 100 ms

var pose = new Float32Array([
    1, 0,     // rotor
    0, 0,     // translator
    1, 1,     // scale
    0, 0.5    // r_center
]);

// ...
await renderer.appendSceneObject(new Standard2DGAPosedVertexObject(renderer._device, renderer._canvasFormat, vertices, pose, "../shaders/gaposer.wgsl", "triangle-list"));

var pose = new Float32Array([
    1, 0, 0, 0,  // motor
    1, 1         // scale
]);

await renderer.appendSceneObject(new Standard2DGAPosedVertexObject(renderer._device, renderer._canvasFormat, vertices, pose, "../shaders/pga.wgsl", "triangle-list"));

