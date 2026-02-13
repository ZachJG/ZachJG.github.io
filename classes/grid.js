import Camera2DVertexObject from "./cameraVertexObject.js"

export default class Grid extends Camera2DVertexObject {
    constructor(device, canvasFormat, cameraPose, vertices, shaderFile, topology, numInstances) {}
    async createGeometry() {
        super.createGeometry();
        // an array of cell statuses in CPU
        this._cellStatus = new Uint32Array(10 * 10); 

        // Create a storage ping-pong-buffer to hold the cell status.
        this._cellStateBuffers = [
            this._device.createBuffer({
                label: "Grid status Buffer 1 " + this.getName(),
                size: this._cellStatus.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            }),
            this._device.createBuffer({
                label: "Grid status Buffer 2 " + this.getName(),
                size: this._cellStatus.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            })
        ];
        // Copy from CPU to GPU
        this._device.queue.writeBuffer(this._cellStateBuffers[0], 0, this._cellStatus);
        // Set a step counter
        this._step = 0;
    }
    async createRenderPipeline() {
        // Create the bind group layout
        this._bindGroupLayout = this._device.createBindGroupLayout({
            label: "Grid Bind Group Layout " + this.getName(),
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX ,
                buffer: {} // Camera uniform buffer
            }, {
                binding: 1,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
                buffer: { type: "read-only-storage"} // Cell status input buffer
            }, {
                binding: 2,
                visibility: GPUShaderStage.COMPUTE,
                buffer: { type: "storage"} // Cell status output buffer
            }]
        });
        this._pipelineLayout = this._device.createPipelineLayout({
            label: "Grid Pipeline Layout",
            bindGroupLayouts: [ this._bindGroupLayout ],
        });
        // create render pipeline with customized layout
        this._renderPipeline = this._device.createRenderPipeline({
            label: "Grid Render Pipeline " + this.getName(),
            layout: this._pipelineLayout,
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
        // create bind group to bind the uniform buffer and the storage buffers
        this._bindGroups = [
            this._device.createBindGroup({
                label: "Grid Bind Group 1 " + this.getName(),
                layout: this._renderPipeline.getBindGroupLayout(0),
                entries: [{
                    binding: 0,
                    resource: { buffer: this._cameraPoseBuffer }
                },{
                    binding: 1,
                    resource: { buffer: this._cellStateBuffers[0] }
                },{
                    binding: 2,
                    resource: { buffer: this._cellStateBuffers[1] }
                }],
            }),
            this._device.createBindGroup({
                label: "Grid Bind Group 2 " + this.getName(),
                layout: this._renderPipeline.getBindGroupLayout(0),
                entries: [{
                    binding: 0,
                    resource: { buffer: this._cameraPoseBuffer }
                }, {
                    binding: 1,
                    resource: { buffer: this._cellStateBuffers[1] }
                },{
                    binding: 2,
                    resource: { buffer: this._cellStateBuffers[0] }
                }],
            })
        ];
    }
    render(pass) {
        // add to render pass to draw the object
        pass.setPipeline(this._renderPipeline);
        pass.setVertexBuffer(0, this._vertexBuffer);
        pass.setBindGroup(0, this._bindGroups[this._step % 2]);  // <- this line is different
        pass.draw(this._vertices.length / 2, this._numInstances);
    }
    // Create a compute pipeline that updates the game state.
    async createComputePipeline() {
        this._computePipeline = this._device.createComputePipeline({
            label: "Grid update pipeline " + this.getName(),
            layout: this._pipelineLayout,
            compute: {
                module: this._shaderModule,
                entryPoint: "computeMain",
            }
        });
    }
    // add to compute pass
    compute(pass) {
        pass.setPipeline(this._computePipeline);
        pass.setBindGroup(0, this._bindGroups[this._step % 2]);     // bind the uniform buffer
        pass.dispatchWorkgroups(Math.ceil(10 / 4), Math.ceil(10 / 4)); // how many workgroups are needed to work in parallel
        ++this._step;
    }
}