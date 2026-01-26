import SceneObject from "./sceneObject.js";

export default class Standard2DFullScreenObject extends SceneObject {
   constructor(device, canvasFormat, img) {
     super(device, canvasFormat, "<we will create this shader file>");
     this._img = new Image();
     this._img.src = img;
   }

   // more methods to implement ...
    async createGeometry() {
        // Load image and create image bitmap
        await this._img.decode();
        this._bitmap = await createImageBitmap(this._img);

        // Create GPU texture to store the image
        this._texture = this._device.createTexture({
            label: "Texture " + this.getName(),
            size: [this._bitmap.width, this._bitmap.height, 1],
            format: "rgba8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST |
                GPUTextureUsage.RENDER_ATTACHMENT,
        });

        // Copy pixels from CPU (bitmap) to GPU (texture)
        this._device.queue.copyExternalImageToTexture(
            { source: this._bitmap },
            { texture: this._texture },
            [this._bitmap.width, this._bitmap.height]
        );

        // Create a sampler for texture filtering
        this._sampler = this._device.createSampler({
            magFilter: "linear",
            minFilter: "linear"
        });
    }

    async createRenderPipeline() {
        this._renderPipeline = this._device.createRenderPipeline({
        label: "Render Pipeline " + this.getName(),
        layout: "auto",
        vertex: {
            module: this._shaderModule,         // the shader code
            entryPoint: "vertexMain",           // the shader function
        },
            fragment: {
            module: this._shaderModule,    // the shader code
            entryPoint: "fragmentMain",    // the shader function
                targets: [{
                format: this._canvasFormat   // the target canvas format
                }]
            }
        });

        // Bind group: connect GPU resources to the shader's bindings
        this._bindGroup = this._device.createBindGroup({
            layout: this._renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                binding: 0,
                resource: this._texture.createView(),
                },
                {
                binding: 1,
                resource: this._sampler,
                }
            ],
        });
    }
    render(pass) {
        // add to render pass to draw the object
        pass.setPipeline(this._renderPipeline);   // which render pipeline to use
        pass.setBindGroup(0, this._bindGroup);    // bind group to bind texture to shader
        pass.draw(6, 1, 0, 0);                    // 6 vertices to draw a quad
    }
    async createComputePipeline() {}

    compute(pass) {}
}