import Standard2DVertexObject from "../classes/vertexObject2d.js";

export default class TriangleShape extends Standard2DVertexObject {
    constructor(device, canvasFormat,vertices) {
        super(device, canvasFormat, vertices, '../shaders/standard2d.wgsl', 'triangle-list');
        this._vertices = vertices;
    }
}