import Standard2DVertexObject from "./vertexObject2d";

export default class Standard2DGAPosedVertexObject extends Standard2DVertexObject {
    constructor(device, canvasFormat, vertices, pose, shaderFile, topology) {
        super(device, canvasFormat, vertices, shaderFile, topology);
        this._pose = pose;
    }

    // More methods to implement
}