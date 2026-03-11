import Standard2DVertexObject from "../classes/vertexObject2d.js";

export default class SmallTriangle extends Standard2DVertexObject {
    constructor(device, canvasFormat) {
        let vertices = new Float32Array([
            // x, y
            -0.8, -0.6,
            -0.6, -0.8,
            -0.4,  -0.6
        ]);
        super(device, canvasFormat, vertices, '../shaders/standard2d.wgsl', 'line-strip');
        this._vertices = vertices;
    }
}