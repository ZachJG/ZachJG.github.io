import Standard2DVertexObject from "./vertexObject2d";

export default class Standard2DGAPosedVertexObject extends Standard2DVertexObject {
    constructor(device, canvasFormat, vertices, pose, shaderFile, topology) {
        super(device, canvasFormat, vertices, shaderFile, topology);
        this._pose = pose;
    }

    // More methods to implement
    async createGeometry() {
        // Call parent's to create vertex geometry
        super.createGeometry();
        // Create pose buffer to store the object pose in GPU
        this._poseBuffer = this._device.createBuffer({
            label: "Pose " + this.getName(),
            size: this._pose.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        // Initial update of the geomtery - in this case only the pose
        this.updateGeometry();
    }
    updateGeometry() {
        // Copy from pose from CPU to GPU
        this._device.queue.writeBuffer(this._poseBuffer, 0, this._pose);
    }
    async createRenderPipeline() {
        // Call parent's to create render pipeline
        super.createRenderPipeline();
        // Creata a bind group to pass the pose buffer into @group(0) @binding(0)
        this._bindGroup = this._device.createBindGroup({
            label: "Render Bind Group " + this.getName(),
            layout: this._renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: { buffer: this._poseBuffer },
                }
            ],
        });
    }
    render(pass) {
        pass.setBindGroup(0, this._bindGroup);  // bind the pose buffer
        super.render(pass);                     // reuse the render function
    }
}