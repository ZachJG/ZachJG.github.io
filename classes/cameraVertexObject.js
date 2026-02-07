import SceneObject from "./sceneObject.js";

export default class Camera2DVertexObject extends SceneObject {
    constructor(device, canvasFormat, cameraPose, vertices, shaderFile, topology) {
        super(device, canvasFormat, shaderFile);
        this._cameraPose = cameraPose; // store the camera pose
        this._vertices = vertices;
        this._topology = topology;
    }
    async createGeometry() {
        // Create vertex buffer to store the vertices in GPU
        this._vertexBuffer = this._device.createBuffer({
            label: "Vertices " + this.getName(),
            size: this._vertices.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });
        // Copy from CPU to GPU
        this._device.queue.writeBuffer(this._vertexBuffer, 0, this._vertices);
        // Define vertex buffer layout - how the GPU should read the buffer
        this._vertexBufferLayout = {
            arrayStride: 2 * Float32Array.BYTES_PER_ELEMENT,
            attributes: [{ 
                // position 0 has two floats
                shaderLocation: 0,   // position in the vertex shader
                format: "float32x2", // two coordinates
                offset: 0,           // no offset in the vertex buffer
            }],
        };
        // Create camera pose buffer to store the uniform color in GPU
        this._cameraPoseBuffer = this._device.createBuffer({
            label: "Camera Pose " + this.getName(),
            size: this._cameraPose.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        }); 
        // Copy from CPU to GPU
        this._device.queue.writeBuffer(this._cameraPoseBuffer, 0, this._cameraPose);
    }
    async createRenderPipeline() {
        this._renderPipeline = this._device.createRenderPipeline({
            label: "Render Pipeline " + this.getName(),
            layout: "auto",
            vertex: {
                module: this._shaderModule,         // the shader code
                entryPoint: "vertexMain",           // the shader function
                buffers: [this._vertexBufferLayout] // the binded buffer layout
            },
            fragment: {
                module: this._shaderModule,    // the shader code
                entryPoint: "fragmentMain",    // the shader function
                targets: [{
                    format: this._canvasFormat   // the target canvas format
                }]
            },
            primitive: {                     
                topology: this._topology       // draw using the specified topology
            }
        });
        // create bind group to bind the uniform buffer
        this._bindGroup = this._device.createBindGroup({
            label: "Renderer Bind Group " + this.getName(),
            layout: this._renderPipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: this._cameraPoseBuffer }
            }],
        });
    }
    updateCameraPose() {
        this._device.queue.writeBuffer(this._cameraPoseBuffer, 0, this._cameraPose);
    }
    render(pass) {
        // add to render pass to draw the object
        pass.setPipeline(this._renderPipeline);      // which render pipeline to use
        pass.setVertexBuffer(0, this._vertexBuffer); // how the buffer are binded
        pass.setBindGroup(0, this._bindGroup);       // bind the uniform buffer
        pass.draw(this._vertices.length / 2);        // number of vertices to draw
    }
    async createComputePipeline() {}
    compute(pass) {}
}