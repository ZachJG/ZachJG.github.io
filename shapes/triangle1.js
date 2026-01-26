import Standard2DVertexObject from "../classes/vertexObject2d.js";

export default class Triangle1 extends Standard2DVertexObject {
    constructor(device, canvasFormat) {
        let vertices = new Float32Array([
            // x, y
            0, 0.5,
            -0.5, 0,
            0.5,  0
        ]);
        super(device, canvasFormat, vertices, '../shaders/standard2d.wgsl', 'triangle-list');
        this._vertices = vertices;
    }
}