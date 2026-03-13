import Standard2DVertexObject from "../classes/vertexObject2d.js";

export default class TriangleShape extends Standard2DVertexObject {
    constructor(device, canvasFormat,vertices,color) {
        super(device, canvasFormat, vertices, '../shaders/chooseColor.wgsl', 'triangle-list');
        this._vertices = vertices;
        this._color = color
    }
}