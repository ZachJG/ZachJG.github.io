import Standard2DVertexObject from "../classes/vertexObject2d.js";

export default class Square extends Standard2DVertexObject {
    constructor(device, canvasFormat) {
        let vertices = new Float32Array([
            // x, y
            0.25, 0.25,
            0.25, 0.5,
            0.5,  0.25,
            0.5, 0.5
        ]);
        super(device, canvasFormat, vertices, '../shaders/standard2d.wgsl', 'square-list');
        this._vertices = vertices;
    }
}