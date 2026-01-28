function LinearInterpolate(A, B, t) {
    return A * (1 - t) + B * t;
}

console.log(LinearInterpolate(0, 10, 0.5));

// Create a triangle geometry
var vertices = new Float32Array([
    // x, y,
    0, 0.25, 
    -0.25, 0,
    0.25,  0,
]);

let pose0 = [1, 0];   // cos(0), -sin(0)
let pose1 = [0, -1];  // cos(pi/2), -sin(pi/2)

var pose = new Float32Array([pose0[0], pose0[1], 0, 0, 1, 1, 0.25, 0.25]);
await renderer.appendSceneObject(new Standard2DGAPosedVertexObject(renderer._device, renderer._canvasFormat, vertices, pose, "/shaders/gaposer.wgsl", "triangle-list"));