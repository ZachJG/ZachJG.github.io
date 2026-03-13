import Standard2DVertexObject from "../classes/vertexObject2d.js";

export default class TriangleShape extends Standard2DVertexObject {
    constructor(device, canvasFormat,vertices,color) {
        super(device, canvasFormat, vertices, '../shaders/chooseColor.wgsl', 'triangle-list');
        this._vertices = vertices;
        this._color = color;
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
        // Create vertex buffer to store the vertices in GPU
        this._colorBuffer = this._device.createBuffer({
            label: "Color " + this.getName(),
            size: this._vertices.byteLength,
            usage: GPUBufferUsage.Color | GPUBufferUsage.COPY_DST,
        });
        // Copy from CPU to GPU
        this._device.queue.writeBuffer(this._colorBuffer, 0, this._color);
        // Define vertex buffer layout - how the GPU should read the buffer
        this._colorBufferLayout = {
            arrayStride: 4 * Float32Array.BYTES_PER_ELEMENT,
            attributes: [{ 
                // position 0 has two floats
                shaderLocation: 1,   // position in the vertex shader
                format: "float32x4", // two coordinates
                offset: 1,           // no offset in the vertex buffer
            }],
        };
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
                buffers: [this._colorBufferLayout],
                targets: [{
                    format: this._canvasFormat   // the target canvas format
                }]
            },
            primitive: {                     
                topology: this._topology       // draw using the specified topology
            }
        }); 
    }
    render(pass) {
        // add to render pass to draw the object
        pass.setPipeline(this._renderPipeline);      // which render pipeline to use
        pass.setVertexBuffer(0, this._vertexBuffer); // how the buffer are binded
        pass.setVertexBuffer(1,this._colorBuffer);
        pass.draw(this._vertices.length / 2);        // number of vertices to draw
        pass.draw(this._color);
    }
    async createComputePipeline() {}
    compute(pass) {}
}