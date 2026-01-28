import Standard2DFullScreenObject from "../classes/standard2dFullScreenObject.js";
import ImageFilterObject from "../classes/imageFilterObject.js";
import ImageNosifyFilterObject from "../classes/imageNosify.js";
import Standard2DGAPosedVertexObject from "../classes/standard2dPose.js";

let shaderCode = await this.loadShader("../shaders/fullScreenTexture.wgsl");

await renderer.appendSceneObject(new Standard2DFullScreenObject(renderer._device, renderer._canvasFormat, "../assets/boatgoesbinted.jpg"));

await renderer.appendFilterObject(new ImageFilterObject(renderer._device, renderer._canvasFormat, "../shaders/8bit.wgsl"));

await renderer.appendFilterObject(new ImageNosifyFilterObject(renderer._device, renderer._canvasFormat, "../shaders/nosify.wgsl"));

var pose = [1, 0, 0, 0, 1, 1]; // rotor, translator, scales
pose = new Float32Array(pose);
await renderer.appendSceneObject(new Standard2DGAPosedVertexObject(renderer._device, renderer._canvasFormat, vertices, pose, "../shaders/gaposer.wgsl", "triangle-list"));

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

let geometricProduct = (a, b) => {
    // ref: https://geometricalgebratutorial.com/pga/
    // eoo = 0, e00 = 1 e11 = 1
    // s + e01 + eo0 + eo1
    // ss   = s   , se01   = e01  , seo0            = eo0  , seo1          = eo1
    // e01s = e01 , e01e01 = -s   , e01eo0 = e10e0o = -eo1 , e01eo1 = -e0o = eo0
    // eo0s = eo0 , eo0e01 = eo1  , eo0eo0          = 0    , eo0eo1        = 0
    // e01s = e01 , eo1e01 = -eo0 , eo1eo0          = 0    , eo1eo1        = 0
    return [
        a[0] * b[0] - a[1] * b[1] , // scalar
        a[0] * b[1] + a[1] * b[0] , // e01
        a[0] * b[2] + a[1] * b[3] + a[2] * b[0] - a[3] * b[1], // eo0
        a[0] * b[3] - a[1] * b[2] + a[2] * b[1] + a[3] * b[0]  // eo1
    ];
};
let reverse = (a) => {
    return [ a[0], -a[1], -a[2], -a[3] ];
};
let motorNorm =  (m) => {
    return Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2] + m[3] * m[3]);
};
let normalizeMotor = (m) => {
    let mnorm = motorNorm(m);
    if (mnorm == 0.0) {
        return [1, 0, 0, 0];
    }
    return [m[0] / mnorm, m[1] / mnorm, m[2] / mnorm, m[3] / mnorm];
};

let angle = Math.PI / 100;
// rotate about center
let center = [0, 0];
let dr = normalizeMotor([Math.cos(angle / 2), -Math.sin(angle / 2), -center[0] * Math.sin(angle / 2), -center[1] * Math.sin(angle / 2)]);
let dt = normalizeMotor([1, 0, 0.01 / 2, 0 / 2]);
let dm = normalizeMotor(geometricProduct(dt, dr));

setInterval(() => { 
    renderer.render();
    // update pose
    let newmotor = normalizeMotor(geometricProduct(dm, [pose[0], pose[1], pose[2], pose[3]]));
    pose[0] = newmotor[0];
    pose[1] = newmotor[1];
    pose[2] = newmotor[2];
    pose[3] = newmotor[3];
}, 100); // call every 100 ms